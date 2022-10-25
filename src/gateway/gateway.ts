import { ForbiddenException, Inject, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Services } from '../utils/constants';
import { AuthenticatedSocket } from '../utils/interfaces';
import { IGatewaySessionManager } from './gateway.session';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: true,
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    this.sessions.setUserSocket(socket.user.userId, socket);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
    console.log(`${socket.user.username} disconnected.`);
    this.sessions.removeUserSocket(socket.user.userId);
  }

  @SubscribeMessage(`sendMessage`)
  async onSendMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const receiverId = Number(body.to);
    const msg = body.msg;
    const receiverSocketId =
      this.sessions.getUserSocket(receiverId)?.user.socketId;

    try {
      await this.prisma.chat.create({
        data: {
          from: socket.user.userId,
          to: receiverId,
          msg: msg || '',
        },
      });

      if (receiverSocketId) {
        this.server.to(String(receiverSocketId)).emit('receiveMessage', {
          title: 'New message',
          from: socket.user.userId,
          to: receiverId,
          msg: msg || '',
        });
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credientials token');
        }
      }
      throw error;
    }
  }
}
