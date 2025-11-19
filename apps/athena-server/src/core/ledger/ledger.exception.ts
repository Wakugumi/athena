import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class LedgerException extends CustomException {
  constructor(technicalMessage: string, code: LedgerExceptionCode, friendlyMessage?: string, httpStatus?: HttpStatus) {
    super(technicalMessage, code, friendlyMessage, httpStatus);
  }
}

export enum LedgerExceptionCode {
  TRANSFER_AMOUNT_NEGATIVE = 'TRANSFER_AMOUNT_NEGATIVE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE'

}
