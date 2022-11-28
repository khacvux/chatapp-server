import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Routes, User } from '../utils/constants';
import { GetChatDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller(Routes.CHAT)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(Routes.GET_CHAT_LIST)
  signin(
    @Param('id', ParseIntPipe) receiverId: number,
    @GetUser(User.ID) userId: number,
  ) {
    return this.chatService.getChat({receiverId}, userId);
  }
  @Post(Routes.GET_CHATS)
  getUser(@Body() dto: GetChatDto, @GetUser(User.ID) userId: number) {
    return this.chatService.getChat(dto, userId);
  }
}
