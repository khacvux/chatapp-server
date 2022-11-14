import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FriendRequestAcceptedException,
  FriendRequestException,
  FriendRequestNotFoundException,
} from './exceptions';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async getFriendRequests(userId: number) {
    const list = await this.prisma.friend.findMany({
      where: {
        OR: [
          {
            AND: [{ userOneId: userId }, { status: 2 }],
          },
          {
            AND: [{ userTwoId: userId }, { status: 2 }],
          },
        ],
      },
    });

    return list.map((item) => {
      if (item.userOneId == userId) {
        item['userId'] = item.userTwoId;
        delete item.userOneId;
        delete item.userTwoId;
        return item;
      } else {
        item['userId'] = item.userOneId;
        delete item.userOneId;
        delete item.userTwoId;
        return item;
      }
    });
  }

  async create(senderId: number, receiverId: number) {
    if (senderId == receiverId)
      throw new ForbiddenException(
        'Cannot create friend request for yourself!',
      );

    const isFriend = await this.isFriend(senderId, receiverId);
    if (isFriend.length) throw new FriendRequestException('');

    const added = await this.prisma.friend.create({
      data: {
        userOneId: senderId,
        userTwoId: receiverId,
        status: 1,
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
    return await this.prisma.friend.update({
      where: {
        userOneId_userTwoId: {
          userOneId: id,
          userTwoId: userId,
        },
      },
      data: {
        status: 2,
      },
    });
  }

  async reject(userId: number, id: number) {
    try {
      return await this.prisma.friend.delete({
        where: {
          userOneId_userTwoId: {
            userOneId: id,
            userTwoId: userId,
          },
        },
      });
    } catch (error) {
      throw new FriendRequestNotFoundException();
    }
  }

  async cancel(userId: number, id: number) {
    try {
      return await this.prisma.friend.delete({
        where: {
          userOneId_userTwoId: {
            userOneId: userId,
            userTwoId: id,
          },
        },
      });
    } catch (error) {
      throw new FriendRequestNotFoundException();
    }
  }

  isFriend(userOneId: number, userTwoId: number) {
    return this.prisma.friend.findMany({
      where: {
        OR: [
          {
            AND: [{ userOneId: userOneId, userTwoId: userTwoId, status: 2 }],
          },
          {
            AND: [{ userOneId: userTwoId, userTwoId: userOneId, status: 2 }],
          },
        ],
      },
    });
  }
}
