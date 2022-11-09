import {
  Body,
  Controller,
  Delete,
  Get,
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
  constructor(private friendRequestService: FriendRequestService) {}

  @Get()
  getFriendRequests(@GetUser('userId') userId: number) {}

  @Post()
  async createFriendRequest(
    @GetUser('userId') userId: number,
    @Body() username: CreateFriendReq,
  ) {}

  @Patch(Routes.ACCEPT_FRIENDS_REQUEST)
  async acceptFriendRequest(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete(Routes.CANCEL_FRIENDS_REQUEST)
  async refuseFriendRequest(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Patch(Routes.CANCEL_FRIENDS_REQUEST)
  async cancelFriendRequest(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
