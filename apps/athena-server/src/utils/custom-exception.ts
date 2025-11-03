import { HttpStatus } from "@nestjs/common";

export class CustomException extends Error {
  code: string;
  userFriendlyMessage?: string;
  httpStatusCode?: HttpStatus

  constructor(message: string, code: string, userFriendlyMessage?: string, httpStatusCode?: HttpStatus) {
    super(message);
    this.code = code;
    this.userFriendlyMessage = userFriendlyMessage;
    this.httpStatusCode = httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR
  }

  getStatus(): HttpStatus {
    return this.httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR
  }
}
