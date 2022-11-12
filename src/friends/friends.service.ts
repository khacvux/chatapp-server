import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getFriends(userId: number) {
    return this.prisma.friend.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async delete(userId: number, id: number) {
    return await this.prisma.friend.delete({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: id,
        },
      },
    });
  }
}
