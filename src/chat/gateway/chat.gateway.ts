import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ForbiddenException, OnModuleInit, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from 'src/auth/constants';
import { GatewayGuard } from '../guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
var global = require('global');
require('dotenv');
@UseGuards(GatewayGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
    constructor(
        private readonly jwtService: JwtService,
        private config: ConfigService,
        private prisma: PrismaService
    ) { }
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
                            console.log(userID + " Connected soketID =" + socket.id)
                        } else {
                            console.log(" disconnect soketID =" + socket.id)
                            socket.disconnect();
                        }
                    } else {
                        console.log(" disconnect soketID =" + socket.id)
                        socket.disconnect();
                    }
                } catch {
                    console.log(" disconnect soketID =" + socket.id)
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
        } catch { }
    }
    @UseGuards(GatewayGuard)
    @SubscribeMessage(`sendMessage`)
    async onSendMessage(@MessageBody() body: any) {
        try {
            const token = body.access_token;
            const JWT_SECRET = { secret: jwtConstants.secret };
            const payload = this.jwtService.verify(token, JWT_SECRET);
            const toUserID = Number(body.to);
            const fromUserName = payload.username;
            const fromUserID = Number(payload.id);
            if (fromUserName) {
                var socketID = global.onlineUsers.get(toUserID);

                if (socketID) {
                    this.server.to(socketID).emit(`reciveMessage`, {
                        title: 'New message',
                        from: fromUserID,
                        to: toUserID,    
                        msg: body.msg || '',
                    });
                }
                try {
                    await this.prisma.chat.create({
                        data:{
                            from: fromUserID,
                            to:toUserID,
                            msg:body.msg || ''
                        }
                    })
                } catch (error) {
                    if (error instanceof PrismaClientKnownRequestError) {
                        if (error.code == 'P2002') {
                          throw new ForbiddenException('Credientials taken');
                        }
                      }
                    throw error;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
