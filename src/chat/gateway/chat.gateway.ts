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
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
var global = require('global');
require("dotenv")
// @UseGuards(JwtGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  constructor(private readonly jwtService: JwtService,private config: ConfigService){}
  @WebSocketServer()
  server: Server;
  onModuleInit() {
    global.onlineUsers = new Map();
    this.server.on('connection', (socket) => {
      global.chatSocket = socket
      // socket.on("connect", (body) => {
      //   console.log("test")
      //   try {
      //     const token = global.onlineUsers.get(body.access_token)
      //     const payload = this.jwtService.verify(token)
      //     const socket = global.chatSocket
      //     console.log("Debug : "+socket.id)
      //     const userID = payload.sub
      //     if (userID&&socket) {
      //       global.onlineUsers.set(userID,socket.id)
      //       console.log(userID+" connected, socketId : "+socket.id)
      //     }
      //   } catch (error) {
      //     console.log(error)
      //   }
      // });
      const userID = socket.id
      global.onlineUsers.set(userID,socket.id)
      console.log(global.onlineUsers)
    });

  }

  @SubscribeMessage(`sendMessage`)
  onSendMessage(@MessageBody() body: any) {
    try {
      const token = body.access_token
      const JWT_SECRET = this.config.get('JWT_SECRET')
      console.log(JWT_SECRET)
      const payload = this.jwtService.verify(token, JWT_SECRET)
      const toUserID = body.to
      const fromUserName = payload.username
      if (fromUserName) {
        var socketID = global.onlineUsers.get(toUserID)
        if (socketID) {
          this.server.to(socketID).emit(`reciveMessage`, {
            title: "New message",
            from: fromUserName,
            msg: body.msg|| ""
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
