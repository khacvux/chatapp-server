import { Injectable } from '@nestjs/common';
// import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAvatarDto, UploadFailException } from '../dtos';
import { NotInGroupException } from '../exceptions';
import { CannotLeaveException } from '../exceptions/CannotLeave';

@Injectable()
export class GroupRecipientService {
  constructor(
    private prisma: PrismaService,
    // private imageStorageService: ImageStorageService,
  ) {}

  async addGroupRecipient(
    userId: number,
    groupId: number,
    recipientId: number,
  ) {
    return this.prisma.usersOnGroup.create({
      data: {
        groupId,
        userId: recipientId,
      },
    });
  }

  async leaveGroup(userId: number, groupId: number) {
    try {
      const inGroup = await this.prisma.group.findUnique({
        where: {
          id: groupId,
        },
        select: {
          creatorId: true,
        },
      });
      if (inGroup.creatorId != userId) throw new CannotLeaveException();
      return this.prisma.usersOnGroup.delete({
        where: {
          groupId_userId: {
            groupId,
            userId,
          },
        },
      });
    } catch (error) {
      throw new NotInGroupException();
    }
  }

  // async updateAvatar(data: UpdateAvatarDto) {
  //   try {
  //     const response = await this.imageStorageService.uploadImage(data.avatar);
  //     if (response.error) throw new UploadFailException();
  //     const uploaded = await this.prisma.group.update({
  //       where: {
  //         id: data.groupId,
  //       },
  //       data: {
  //         avatarId: response.publicId,
  //         avatar: response.url,
  //       },
  //       select: {
  //         avatar: true,
  //       },
  //     });
  //     return uploaded;
  //   } catch (error) {
  //     throw new UploadFailException();
  //   }
  // }
}
