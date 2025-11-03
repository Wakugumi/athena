import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CustomException } from "./custom-exception";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp()
    const status = exception instanceof CustomException ? exception.httpStatusCode : exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof CustomException ? exception.message : exception instanceof HttpException ? exception.message : (exception as Error).message;

    const responseBody = {

      statusCode: status,
      message: message,
      timestamp: new Date().toISOString()

      ,
      path: httpAdapter.getRequestUrl(context.getRequest())
    }



    httpAdapter.reply(context.getResponse(), responseBody, status)
  }

}
