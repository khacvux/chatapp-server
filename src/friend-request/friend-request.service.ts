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
        userTwoId: userId,
        status: 1,
      },
      select: {
        UserOne: {
          select: {
            username: true,
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return list.map((item) => {
      item['id'] = item.UserOne.id;
      item['username'] = item.UserOne.username;
      item['email'] = item.UserOne.email;
      item['firstName'] = item.UserOne.firstName;
      item['lastName'] = item.UserOne.lastName;
      item['avatar'] = item.UserOne.avatar;
      delete item.UserOne
      return item;
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
            userTwoId: userId
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
