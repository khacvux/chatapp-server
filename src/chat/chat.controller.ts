import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Routes, User } from 'src/utils/constants';
import { ChatService } from './chat.service';
import { GetChatDto } from './dto';


@UseGuards(JwtGuard)
@Controller(Routes.CHAT)
export class ChatController {
  constructor(private chatService: ChatService) { }

  @HttpCode(HttpStatus.OK)

  @Post(Routes.GET_CHATS)
  getUser(@Body() dto: GetChatDto, @GetUser(User.ID) userId: number) {
    return this.chatService.getChat(dto, userId);
  }
}
