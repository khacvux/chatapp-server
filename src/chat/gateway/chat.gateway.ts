import { ForbiddenException, Inject } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { IGatewaySessionManager } from 'src/gateway/gateway.session';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
    cors: true,
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(Services.GATEWAY_SESSION_MANAGER)
        readonly sessions: IGatewaySessionManager,
        private prisma: PrismaService
    ) { }

    @WebSocketServer()
    server: Server;

    handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
        console.log(`${socket.user.username} Incoming Connection`);
        this.sessions.setUserSocket(socket.user.id, socket);
    }

    handleDisconnect(socket: AuthenticatedSocket) {
        console.log(`${socket.user.username} disconnected.`);
        this.sessions.removeUserSocket(socket.user.id);
    }

    @SubscribeMessage(`sendMessage`)
    async onSendMessage(
        @MessageBody() body: any,
        @ConnectedSocket() socket: AuthenticatedSocket,
    ) {
        const senderId = Number(socket.user.id);
        const senderUsername = socket.user.username;
        const receiverId = Number(body.to);
        const msg = body.msg;
        const receiverSocketId = this.sessions.getUserSocket(receiverId)?.user.socketId;
        try {
            await this.prisma.chat.create({
                data: {
                    from: senderId,
                    to: receiverId,
                    msg: msg || ''
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
        try {
            if (receiverSocketId) {
                this.server.to(String(receiverSocketId)).emit('receiveMessage', {
                    title: `New message from ${senderUsername}`,
                    from: senderId,
                    to: receiverId,
                    msg: msg || '',
                });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
