import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChat(dto: GetChatDto, userId: number) {
    return this.prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [{ from: userId }, { to: dto.receiverId }],
          },
          {
            AND: [{ from: dto.receiverId }, { to: userId }],
          },
        ],
      },
    });
  }
}
