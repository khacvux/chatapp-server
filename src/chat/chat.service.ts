import { Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetChatDto } from './dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getChat(dto: GetChatDto, userId: number) {
        try {
            const chats = (await this.prisma.chat.findMany({
                orderBy:{
                    id: 'asc'
                },
                where: {
                    OR: [
                        {
                            AND: [
                                { from: userId },
                                { to: dto.receiverId }
                            ]
                        },
                        {
                            AND: [
                                { from: dto.receiverId },
                                { to: userId }
                            ]
                        }
                    ]
                }
            }))
            // .sort((a, b) => compareFn(a, b));
            function compareFn(a: Chat, b: Chat) {
                if (a['id'] > b['id']) return 1;
                if (a['id'] < b['id']) return -1;
                return 0;
            }
            return { status: true, chats: chats }
        } catch (error) {
            return { status: false}
        }
    } 
}