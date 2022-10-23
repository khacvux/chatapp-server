import { Body, Controller, HttpCode, HttpStatus, Post, } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGetChat} from './dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  
  @HttpCode(HttpStatus.OK)

  @Post('getchats')
  getUser(@Body() dto:AuthGetChat ) {
    return this.chatService.getChat(dto);
  }
}
