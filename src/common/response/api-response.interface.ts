export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: string;
}
