import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import ENV from '../config/env.variables';
import { jwtTokenManager } from './token/JwtTokenManager.class';
import {
  apiErrorResponseSchema,
  apiSuccessResponseSchema,
  type ApiErrorResponse,
  type ApiResponse,
  type ApiSuccessResponse,
} from '../types/api/ApiResponse';
import { toast } from 'sonner';
import toastWrapper from '@/utils/toastWrapper';

const creatAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: ENV.BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

type CustomAxiosRequestOptions = AxiosRequestConfig & {
  params?: Record<string, unknown>;
};
class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.api = creatAxiosInstance();

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth header
    this.api.interceptors.request.use(
      async (config) => {
        const token = await jwtTokenManager.getInitialAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            this.processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            jwtTokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        } else {
          this.displayDevAlert(error.response?.status, error.message);
        }

        return Promise.reject(error);
      },
    );
  }

  // Process failed request queue
  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  private displayDevAlert = (statusCode: number, error: string) => {
    toastWrapper.dev.error(`Request failed with status ${statusCode} - ${error}`, {
      description: `${error}`,
    });
  };

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    const newAccessToken = await jwtTokenManager.refreshAccessToken();
    if (!newAccessToken) {
      throw new Error('Failed to refresh access token');
    }
    return newAccessToken;
  }

  toApiResponse<T>(response: AxiosResponse<ApiSuccessResponse<T>, unknown, object>): ApiResponse<T> {
    const responseBody = response.data;
    return {
      data: responseBody.data,
      status: response.status,
      success: true,
      message: responseBody.message,
      timestamp: responseBody.timestamp,
    };
  }

  validateApiErrorSchema(response: ApiResponse<unknown>): response is ApiErrorResponse {
    const parsed = apiErrorResponseSchema.safeParse(response);
    if (parsed.success) {
      return true;
    }
    toastWrapper.dev.Critical('Response is not of type ApiErrorResponse');
    return false;
  }

  validateApiResponseSchema(data: ApiResponse<unknown>): void {
    const parsedSchema = apiSuccessResponseSchema.safeParse(data);
    if (!parsedSchema.success) {
      toastWrapper.dev.Critical('API response schema validation failed');
    }
  }

  handleApiErrorResponse(error: unknown): ApiErrorResponse {
    if (typeof error !== 'object' && error === null) {
      toastWrapper.dev.Critical('Unknown error, error is not an object or is null');
      return {
        status: 0,
        success: false,
        message: 'Unknown error occurred',
        timestamp: new Date(),
        path: '',
      };
    }

    const isAxiosError = axios.isAxiosError(error);

    if (isAxiosError && error.response) {
      this.validateApiErrorSchema(error.response.data);
      return error.response?.data as ApiErrorResponse;
    } else if (isAxiosError && error.request) {
      // ⚠️ No response received — network error or timeout
      this.displayDevAlert(0, 'No response received from server — network error or timeout');
      return {
        status: 0,
        success: false,
        message: 'No response received from server',
        timestamp: new Date(),
        path: '',
      };
    } else {
      // ⚠️ Something else went wrong setting up the request
      toastWrapper.dev.Critical('Something else went wrong setting up the request');
      return { status: 0, success: false, message: 'Request setup error', timestamp: new Date(), path: '' };
    }
  }

  // Wrapper methods with error handling
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);

      this.validateApiResponseSchema(response.data);

      return this.toApiResponse(response as AxiosResponse<ApiSuccessResponse<T>>);
    } catch (error: ApiErrorResponse | unknown) {
      return this.handleApiErrorResponse(error);
    }
  }

  async getThrowable<T>(url: string, config?: CustomAxiosRequestOptions): Promise<ApiSuccessResponse<T>> {
    // ! baddl zokom return type ApiSuccessResponse<T> ? defck 3la l containy l zouz wa9telli l eror throwable
    try {
      const response = await this.api.get<ApiSuccessResponse<T>>(url, config);

      this.validateApiResponseSchema(response.data);

      console.log('ousil wel resonse data =', response.data);
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: ApiErrorResponse | unknown) {
      const errorResponse = this.handleApiErrorResponse(error);
      throw errorResponse;
    }
  }

  async post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiSuccessResponse<T>>(url, data, config);

      this.validateApiResponseSchema(response.data);

      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;
      console.log('error : ', error);
      console.log('status from the try catch : ', status);
      // if (status !== 201 || status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status: status ?? 401, success: false };
    }
  }

  async postThrowable<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);

      if (response.data.success === false) {
        throw new Error('Success field false, this should never happen in a successful request');
      }
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;

      if (status !== 201 || status !== 200) this.displayDevAlert(status, apiErrorMessage);

      throw { error: apiErrorMessage, status, success: false };
    }
  }

  async put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      if (response.data.success === false) {
        throw new Error('Success field false, this sohuld never happens in a successful request');
      }
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;

      if (status !== 200) this.displayDevAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }

  async putThrowable<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      if (response.data.success === false) {
        throw new Error('Success field false, this sohuld never happens in a successful request');
      }
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;

      if (status !== 200) this.displayDevAlert(status, apiErrorMessage);

      throw { error: apiErrorMessage, status, success: false };
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      if (response.data.success === false) {
        throw new Error('Success field false, this sohuld never happens in a successful request');
      }
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;

      if (status !== 200) this.displayDevAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }

  async deleteThrowable<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      if (response.data.success === false) {
        throw new Error('Success field false, this sohuld never happens in a successful request');
      }
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed';

      const status = error.response?.status;

      if (status !== 200) this.displayDevAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }
}

export const apiService = new ApiService();
