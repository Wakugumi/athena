import { CustomException } from 'src/utils/custom-exception';

export enum StorageExceptionCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
}
export class StorageException extends CustomException {
  constructor(message: string, code: StorageExceptionCode) {
    super(message, code);
  }
}
