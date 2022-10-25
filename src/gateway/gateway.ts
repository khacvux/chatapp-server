import { Inject, OnModuleInit } from '@nestjs/common';
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

@WebSocketGateway({
  cors: true,
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
    
  ) {}
  
  @WebSocketServer()
  server: Server;


  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    // console.log(socket)
    // this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', {});
  }
  

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
    // console.log(`${socket.user.username} disconnected.`);
    // this.sessions.removeUserSocket(socket.user.id);

  }
}
