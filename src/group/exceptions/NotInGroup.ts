import { HttpException, HttpStatus } from '@nestjs/common';

export class NotInGroupException extends HttpException {
  constructor() {
    super('Not in group', HttpStatus.BAD_REQUEST);
  }
}
