import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import ENV from "../../utils/env.variables";
import { jwtTokenManager } from "../token/JwtTokenManager.class";


export interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    data: T;
    error?: string | { [key: string]: string };
}


const creatAxiosInstance = (): AxiosInstance => {

    return axios.create({
        baseURL: ENV.BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

class ApiService {
    private api: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (error: any) => void;
    }> = [];

    constructor() {

        this.api = creatAxiosInstance();

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - add auth header
        this.api.interceptors.request.use(
            (config) => {
                const token = jwtTokenManager.getAccessToken();
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
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Process failed request queue
    private processQueue(error: any, token: string | null = null): void {
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
        alert(`Request failed with status ${statusCode} - error message: ${error}`);
    }

    // Refresh access token
    private async refreshAccessToken(): Promise<string> {
        const refreshToken = jwtTokenManager.getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${this.api.defaults.baseURL}/user/refresh`, {
            refreshToken,
        });

        jwtTokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
    }


    // Wrapper methods with error handling
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.get<T>(url, config);
            return { data: response.data, status: response.status, success: true };
        } catch (error: any) {

            const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed'

            const status = error.response?.status
            if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

            return { error: apiErrorMessage, data: {} as any, status, success: false };
        }
    }


    async getThrowable<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.get<T>(url, config);
            return { data: response.data, status: response.status, success: true };
        } catch (error: any) {

            const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed'

            const status = error.response?.status

            if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

            throw { error: apiErrorMessage, data: {} as any, status, success: false };
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.post<T>(url, data, config);
            return { data: response.data, status: response.status, success: true };
        } catch (error: any) {

            const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed'

            const status = error.response?.status

            if (status !== 201) this.throwErrorAlert(status, apiErrorMessage);

            return { error: apiErrorMessage, data: {} as any, status, success: false };

        }
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.put<T>(url, data, config);
            return { data: response.data, status: response.status, success: true };
        } catch (error: any) {

            const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed'

            const status = error.response?.status

            if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

            return { error: apiErrorMessage, data: {} as any, status, success: false };

        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.delete<T>(url, config);
            return { data: response.data, status: response.status, success: true };
        } catch (error: any) {

            const apiErrorMessage = error.response?.data?.error || error.message || 'Request failed'

            const status = error.response?.status

            if (status !== 200) this.throwErrorAlert(status, apiErrorMessage);

            return { error: apiErrorMessage, data: {} as any, status, success: false };
        }
    }


}

export const apiService = new ApiService();

