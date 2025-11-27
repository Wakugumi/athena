import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { CustomException } from "./custom-exception";
import { Request, Response } from 'express'

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const status = exception instanceof CustomException ? exception.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof CustomException ? exception.message : (exception as Error).message;
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>();

    const responseBody = {

      statusCode: status,
      message: message,
      timestamp: new Date().toISOString()

      ,
      path: request.url
    }


    response.status(status!).json(responseBody)

  }

}
