import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Gateway } from '../gateway/gateway';

@Module({
  providers: [ChatService]
})
export class ChatModule {}
