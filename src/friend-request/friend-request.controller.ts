import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendReq } from './dtos';

@UseGuards(JwtGuard)
@Controller(Routes.FRIENDS_REQUEST)
export class FriendRequestController {
  constructor(private service: FriendRequestService) {}

  @Get()
  getFriendRequests(@GetUser('id') userId: number) {
    return this.service.getFriendRequests(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get(Routes.CREATE_FRIENDS_REQUEST)
  createFriendRequest(
    @GetUser('id') senderId: number,
    @Param('id', ParseIntPipe) receiverId: number,
  ) {
    return this.service.create(senderId, receiverId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(Routes.ACCEPT_FRIENDS_REQUEST)
  async acceptFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.accept(userId, id);
  }

  @Delete(Routes.REJECT_FRIENDS_REQUEST)
  async rejectFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.reject(userId, id);
  }

  @Delete(Routes.CANCEL_FRIENDS_REQUEST)
  async cancelFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.cancel(userId, id);
  }
}
