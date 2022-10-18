import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from 'src/auth/constants';
import { GatewayGuard } from '../guard';
var global = require('global');
require('dotenv');
@UseGuards(GatewayGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}
  @WebSocketServer()
  server: Server;
  @UseGuards(GatewayGuard)
  onModuleInit() {
    global.onlineUsers = new Map();
    this.server.on('connection', (socket) => {
      const token =
        socket.handshake.auth.access_token ||
        socket.handshake.headers['access_token'];
      if (token) {
        const JWT_SECRET = { secret: jwtConstants.secret };
        try {
          const payload = this.jwtService.verify(token, JWT_SECRET);
          if (payload) {
            const userID = payload.id;
            if (userID) {
              global.onlineUsers.set(userID, socket.id);
            }
          }
        } catch {
          socket.disconnect();
        }
      }
    });
  }
  @UseGuards(GatewayGuard)
  async handleDisconnect(client: any) {
    try {
      const token =
        client.handshake?.auth?.access_token ||
        client.handshake?.headers['access_token'];
      const JWT_SECRET = { secret: jwtConstants.secret };
      const payload = this.jwtService.verify(token, JWT_SECRET);
      const userID = payload.id;
      if (userID) {
        global.onlineUsers.delete(userID)
      }
    } catch{}
  }
  @UseGuards(GatewayGuard)
  @SubscribeMessage(`sendMessage`)
  async onSendMessage(@MessageBody() body: any) {
    try {
      const token = body.access_token;
      const JWT_SECRET = { secret: jwtConstants.secret };
      const payload = this.jwtService.verify(token, JWT_SECRET);
      const toUserID = body.to;
      const fromUserName = payload.username;
      if (fromUserName) {
        var socketID = global.onlineUsers.get(toUserID);
        
        if (socketID) {
          this.server.to(socketID).emit(`reciveMessage`, {
            title: 'New message',
            from: {
              id: payload.id,
              username: fromUserName
            },
            msg: body.msg || '',
          });
        } 
      }
    } catch (error) {
      console.log(error);
    }
  }
}
