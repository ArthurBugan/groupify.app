export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  next?: string | null;
  previous?: string | null;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  search?: string;
  [key: string]: unknown;
}