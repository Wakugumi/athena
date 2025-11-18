import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class OrderException extends CustomException {

  constructor(message: string, code: OrderExceptionCode, friendlyMessage?: string, statusCode?: HttpStatus) {
    super(message, code, friendlyMessage, statusCode);
  }
}

export enum OrderExceptionCode {
  ORDER_NOT_EXIST = 'ORDER_NOT_EXIST',
  LISTING_NOT_FOUND = 'LISTING_NOT_FOUND',
  ORDER_LISTING_TWICE = 'ORDER_LISTING_TWICE',
  LISTING_OWNER_MISMATCH = 'LISTING_OWNER_MISMATCH'

}
