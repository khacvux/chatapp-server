import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotLeaveException extends HttpException {
  constructor() {
    super('You cannot leave this group!', HttpStatus.BAD_REQUEST);
  }
}
