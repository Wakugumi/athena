export type ApiResponse<T> = {
  statusCode: number;
  data?: T;
  /**
   * Backend ensure an friendly error message
   */
  error?: string;
  message?: string
}
