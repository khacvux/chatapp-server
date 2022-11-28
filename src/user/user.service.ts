import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updatePeerId(peerId: string, userId: number) {
    console.log(peerId, userId)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        peerId: peerId,
      },
    });
    return
    ;
  }

  async deletePeerId(userId: number) {
    this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        peerId: null,
      },
    });
    return;
  }

  async get(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        peerId: true,
      },
    });
  }
}
