import { HttpException, HttpStatus } from '@nestjs/common';

export class UploadFailException extends HttpException {
  constructor(msg?: string) {
    const defaultMessage = 'Upload Fail Exception';
    const error = msg ? defaultMessage.concat(': ', msg) : defaultMessage;
    super(error, HttpStatus.BAD_REQUEST);
  }
}
