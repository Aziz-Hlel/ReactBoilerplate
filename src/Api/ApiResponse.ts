



type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  status: number;
  data: T;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

type ApiErrorResponse = {
  success: false;
  status: number;
  error: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
