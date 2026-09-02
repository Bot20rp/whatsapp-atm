export interface ApiErrorPayload {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = payload.statusCode || 500;
    this.code = payload.code;
    this.errors = payload.errors;
  }
}

