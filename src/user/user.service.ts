import { ForbiddenException, Injectable } from '@nestjs/common';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAvatarDto, UpdateInfoDto } from './dto';
import { UploadFailException } from './exceptions';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private imageStorageService: ImageStorageService,
  ) {}

  async updateAvatar(userId: number, payload: UpdateAvatarDto) {
    try {
      const response = await this.imageStorageService.uploadImage(
        payload.avatar,
      );
      if (response.error) throw new UploadFailException();
      const uploaded = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: response.url,
          avatarId: response.publicId,
        },
        select: {
          avatar: true,
        },
      });
      return { avatar: uploaded.avatar };
    } catch (error) {
      throw new UploadFailException();
    }
  }

  async updateInfo(userId: number, payload: UpdateInfoDto) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        },
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
