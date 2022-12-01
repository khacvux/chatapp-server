import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Routes } from 'src/utils/constants';
import { UpdatePeerIdDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller(Routes.USER)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get(Routes.GET_PEERID)
  get(@Param('id', ParseIntPipe) userId: number) {
    return this.service.get(userId);
  }

  @Post(Routes.UPDATE_PEERID)
  update(@GetUser('id') userId: number, @Body() { peerId }: UpdatePeerIdDto) {
    return this.service.updatePeerId(peerId, userId);
  }

  @Delete(Routes.DELETE_PEERID)
  delete(@GetUser('id') userId: number) {
    return this.service.deletePeerId(userId);
  }

  // @
}
