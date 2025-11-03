import { ApiResponse } from '@athena/types';
import { BadRequestException, CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode ?? HttpStatus.OK,
        success: true,
        data: data
      })), catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let message =
          error instanceof HttpException
            ? error.message
            : 'Internal server error';



        if (error instanceof BadRequestException) {
          const responseBody = error.getResponse() as any;
          if (responseBody.message && Array.isArray(responseBody.message)) {
            // e.g. ['email must be an email', 'password must be longer than 6 characters']
            message = responseBody.message.join('; ');
          } else {
            message = responseBody.message || 'Validation failed';
          }
        } else {
          message =
            error instanceof HttpException
              ? (error.getResponse() as any)?.message || error.message
              : error;
        }
        console.error(error)
        return throwError(() => ({
          success: false,
          statusCode: status,
          message,
        }))
      }))
  }
}
