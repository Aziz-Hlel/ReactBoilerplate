import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import ENV from "../config/env.variables";
import { jwtTokenManager } from "./token/JwtTokenManager.class";
import type { ApiResponse, ApiSuccessResponse } from "./ApiResponse";
import { toast } from "sonner";

const creatAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: ENV.BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

type CustomAxiosRequestOptions = AxiosRequestConfig & {
  params?: Record<string, any>;
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
      (error) => Promise.reject(error)
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
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        } else {
          this.throwErrorAlert(error.response?.status, error.message);
        }

        return Promise.reject(error);
      }
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

  private throwErrorAlert = (statusCode: number, error: string) => {
    // if (ENV.NODE_ENV === 'prod') return
    // alert(`Request failed with status ${statusCode} -\nerror message: ${error}`);
    // AlertInfo("Error", error);
    console.log("t5l nyk ?");
    toast.error(`Request failed with status ${statusCode} - ${error}`, {
      description: `${error}`,
    });
  };

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    const newAccessToken = await jwtTokenManager.refreshAccessToken();
    if (!newAccessToken) {
      throw new Error("Failed to refresh access token");
    }
    return newAccessToken;
  }

  toApiResponse<T>(
    response: AxiosResponse<ApiSuccessResponse<T>, any, {}>
  ): ApiResponse<T> {
    const responseBody = response.data;
    return {
      data: responseBody.data,
      status: response.status,
      success: true,
      message: responseBody.message,
      timestamp: responseBody.timestamp,
    };
  }
  // Wrapper methods with error handling
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);

      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
      }
      return this.toApiResponse(
        response as AxiosResponse<ApiSuccessResponse<T>>
      );
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;
      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }

  async getThrowable<T>(
    url: string,
    config?: CustomAxiosRequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      console.log("ousil b3d response");
      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
      }
      console.log("ousil wel resonse data =", response.data);
      const responseBody = response.data;

      return {
        data: responseBody.data,
        status: response.status,
        success: true,
        message: responseBody.message,
        timestamp: responseBody.timestamp,
      };
    } catch (error: any) {
      console.log("l error ml lob", error);
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      throw { error: apiErrorMessage, status, success: false };
    }
  }

  async post<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);

      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;
      console.log("error : ", error);
      console.log("status from the try catch : ", status);
      // if (status !== 201 || status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status: status ?? 401, success: false };
    }
  }

  async postThrowable<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);

      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 201 || status !== 200)
        this.throwErrorAlert(status, apiErrorMessage);

      throw { error: apiErrorMessage, status, success: false };
    }
  }

  async put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }

  async putThrowable<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      throw { error: apiErrorMessage, status, success: false };
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }

  async deleteThrowable<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      if (response.data.success === false) {
        throw new Error(
          "Success field false, this sohuld never happens in a successful request"
        );
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
      const apiErrorMessage =
        error.response?.data?.error || error.message || "Request failed";

      const status = error.response?.status;

      if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

      return { error: apiErrorMessage, status, success: false };
    }
  }
}

export const apiService = new ApiService();
