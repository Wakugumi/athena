import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class EsrowException extends CustomException {
  constructor(message: string, code: EsrowExceptionCode, friendlyMessage?: string, statusCode?: HttpStatus) {
    super(message, code, friendlyMessage, statusCode)
  }

}

export enum EsrowExceptionCode {
  ORDER_NOT_EXIST = "ORDER_NOT_EXIST"
}
