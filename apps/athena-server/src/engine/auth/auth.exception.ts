
import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class AuthException extends CustomException {

  constructor(message: string, code: AuthExceptionCode, friendlyMessage?: string, httpStatus?: HttpStatus) {
    super(message, code, friendlyMessage, httpStatus);
  }
}


export enum AuthExceptionCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_INPUT = "INVALID_INPUT",
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
}
