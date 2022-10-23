import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
                const chats = await this.prisma.chat.findMany({
                    take: 10,
                    where: {
                        OR: [
                            {
                                AND:
                                    [
                                        { from: payload.id },
                                        { to: dto.to }
                                    ]
                            },
                            {
                                AND:
                                    [
                                        { from: dto.to },
                                        { to: payload.id }
                                    ]
                            }
                        ]
                    }
                });
                return { status: true, chats: chats }
            } else return { status: false, chats: [] }
        } catch {
            return { status: false, chats: [] }
        }
    }
}
