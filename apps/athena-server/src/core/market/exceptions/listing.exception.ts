import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class ListingException extends CustomException {


  constructor(message: string, code: ListingExceptionCode, friendlyMessage?: string, statusCode?: HttpStatus) {
    super(message, code, friendlyMessage, statusCode)

  }
}


export enum ListingExceptionCode {
  LISTING_ALREADY_PUBLISHED = 'LISTING_ALREADY_PUBLISHED',
  LISTING_NOT_EXIST = 'LISTING_NOT_EXIST',
  LISTING_NOT_READY = 'LISTING_NOT_READY',
  LISTING_UNAUTHORIZED = 'LISTING_UNAUTHORIZED'
}
