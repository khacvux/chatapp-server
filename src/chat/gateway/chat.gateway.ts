import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: {} })
export class ChatGateway
//   implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
  ) // private conversationService: ConversationService,
  {}
  //   onModuleInit() {
  //     this.conversationService
  //       .removeActiveConversations()
  //       .pipe(take(1))
  //       .subscribe();
  //     this.conversationService.removeMessages().pipe(take(1)).subscribe();
  //     this.conversationService.removeConversations().pipe(take(1)).subscribe();
  //   }

  @WebSocketServer()
  server: Server;
}
