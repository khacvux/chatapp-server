import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FriendRequestAcceptedException,
  FriendRequestException,
} from './exceptions';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async getFriendRequests(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
    });
  }

  async create(senderId: number, receiverId: number) {
    if (senderId == receiverId)
      throw new ForbiddenException(
        'Cannot create friend request for yourself!',
      );

    const isFriend = await this.isFriend(senderId, receiverId);
    if (isFriend.length) throw new FriendRequestException('');

    const existRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
    });

    if (existRequest) throw new FriendRequestException('friend_request exist');

    const added = await this.prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        status: 0,
      },
    });
    if (!added) throw new FriendRequestException('friend_request exist');
    return;
  }

  async accept(userId: number, id: number) {
    if (userId == id)
      throw new ForbiddenException(
        'Cannot create friend request for yourself!',
      );
    const isFriend = await this.isFriend(userId, id);
    if (isFriend.length) throw new FriendRequestAcceptedException();

    const deleted = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: id,
          receiverId: userId,
        },
      },
    });

    if (!deleted) throw new FriendRequestAcceptedException();

    return await this.prisma.friend.create({
      data: {
        userId: userId,
        friendId: id,
      },
    });
  }

  async reject(userId: number, id: number) {
    return await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: id,
          receiverId: userId,
        },
      },
    });
  }

  async cancel(userId: number, id: number) {
    return await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: id,
        },
      },
    });
  }

  isFriend(userOneId: number, userTwoId: number) {
    return this.prisma.friend.findMany({
      where: {
        OR: [
          {
            AND: [{ userId: userOneId, friendId: userTwoId }],
          },
          {
            AND: [{ userId: userTwoId, friendId: userOneId }],
          },
        ],
      },
    });
  }
}
