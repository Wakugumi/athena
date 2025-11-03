import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class UserException extends CustomException {

  constructor(message: string, code: UserExceptionCode, friendlyMesssage?: string, statusCode?: HttpStatus) {
    super(message, code, friendlyMesssage, statusCode)
  }
}

export enum UserExceptionCode {
  USER_NOT_EXIST = "USER_NOT_EXIST"

}
