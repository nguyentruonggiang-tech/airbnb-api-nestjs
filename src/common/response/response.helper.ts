import { ApiResponse } from './api-response.interface';
import { DEFAULT_SUCCESS_MESSAGE } from '../constant/app.constant';

export function responseSuccess<T>(
  content: T,
  message?: string,
  statusCode = 200,
): ApiResponse<T> {
  return {
    statusCode,
    message: message ?? DEFAULT_SUCCESS_MESSAGE,
    content,
    dateTime: new Date().toISOString(),
  };
}

export function responseError(
  message: string,
  statusCode: number,
): ApiResponse<null> {
  return {
    statusCode,
    message,
    content: null,
    dateTime: new Date().toISOString(),
  };
}
