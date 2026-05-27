import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { responseSuccess } from '../response/response.helper';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse();

    const message =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) ??
      undefined;

    return next.handle().pipe(
      map((data) => responseSuccess(data, message, res.statusCode)),
    );
  }
}
