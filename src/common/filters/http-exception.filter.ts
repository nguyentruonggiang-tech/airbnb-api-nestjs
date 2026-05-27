import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { responseError } from '../response/response.helper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const res = httpContext.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = this.extractMessage(exception.getResponse());
    }

    res.status(statusCode).json(responseError(errorMessage, statusCode));
  }

  private extractMessage(exceptionResponseBody: string | object): string {
    if (typeof exceptionResponseBody === 'string') {
      return exceptionResponseBody;
    }

    const body = exceptionResponseBody as Record<string, unknown>;
    const { message } = body;

    if (Array.isArray(message)) {
      return message.map(String).join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'Internal server error';
  }
}
