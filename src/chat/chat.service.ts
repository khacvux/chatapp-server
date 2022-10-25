import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Chat } from '@prisma/client';
import { max } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGetChat } from './dto';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private auth: AuthService
    ) { }
    async getChat(dto: AuthGetChat) {
        try {
            const JWT_SECRET = { secret: jwtConstants.secret }
            var payload: any
            try {
                payload = this.jwt.verify(dto.token, JWT_SECRET);
            } catch {
                return { status: false, chats: [] }
            }
            const user = await this.auth.checkUser(payload)

            if (user) {
                const chats = (await this.prisma.chat.findMany({
                    // take: 20,
                    // orderBy: [
                    //     { id: 'desc' }
                    // ],
                    where: {
                        OR: [
                            {
                                AND: [
                                    { from: payload.id },
                                    { to: dto.to }
                                ]
                            },
                            {
                                AND: [
                                    { from: dto.to },
                                    { to: payload.id }
                                ]
                            }
                        ]
                    }
                }))
                // .sort((a, b) => compareFn(a, b));
                function compareFn(a:Chat, b:Chat) {
                    // >>>>>
                    if (a['id']>b['id'])return 1;
                    if (a['id']<b['id'])return -1;
                    return 0;
                }
                return { status: true, chats: chats }
            } else return { status: false, chats: [] }
        } catch {
            return { status: false, chats: [] }
        }
    }
}
