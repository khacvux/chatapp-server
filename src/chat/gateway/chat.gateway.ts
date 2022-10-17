import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GoneException, Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { AuthSignIn } from 'src/auth/dto';
import { GetUserID } from 'src/auth/decorator';
import { User } from '@prisma/client';
var global = require('global');

@UseGuards(JwtGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  onModuleInit() {
    global.onlineUsers = new Map();
    this.server.on('connection', (socket) => {
      global.chatSocket = socket
    });
  }

  @SubscribeMessage(`connect`)
  onConnect(@MessageBody() body: any) {
    try {
      const token = global.onlineUsers.get(body.access_token)
      const socket = global.chatSocket
      const userID = GetUserID(token) 
      if (userID&&socket) {
        global.onlineUsers.set(userID,socket.id)
      }
    } catch (error) {
      console.log(error)
    }
  }
  @SubscribeMessage(`newMessage`)
  onNewMessage(@MessageBody() body: any) {
    try {
      var toUserID = global.onlineUsers.get(body.to)
      if (toUserID) {
        this.server.to(toUserID).emit(`onMessage`, {
          title: "New message",
          from: body.from || "",
          msg: body.msg|| ""
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
