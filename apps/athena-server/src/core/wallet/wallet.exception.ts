import { HttpStatus } from "@nestjs/common";
import { CustomException } from "src/utils/custom-exception";

export class WalletException extends CustomException {
  constructor(message: string, code: WalletExceptionCode, friendlyMessage?: string, statusCode?: HttpStatus) {
    super(message, code, friendlyMessage, statusCode)
  }

}


export enum WalletExceptionCode {
  WALLET_NOT_EXIST = 'WALLET_NOT_EXIST',
  WALLET_ALREADY_HAVE = 'WALLET_ALREADY_HAVE'
}
