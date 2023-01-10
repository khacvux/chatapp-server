import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Routes } from 'src/utils/constants';
import { UpdateAvatarDto, UpdateInfoDto } from './dto';
import { UserService } from './user.service';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@UseGuards(JwtGuard)
@Controller(Routes.USER)
export class UserController {
  constructor(private readonly service: UserService) {}

  @FormDataRequest({ storage: FileSystemStoredFile })
  @Post(Routes.UPDATE_AVATAR)
  updateAvatar(
    @GetUser('id') userId: number,
    @Body() payload: UpdateAvatarDto,
  ) {
    return this.service.updateAvatar(userId, payload);
  }

  @Post(Routes.UPDATE_INFO)
  updateInfo(@GetUser('id') userId: number, @Body() payload: UpdateInfoDto) {
    return this.service.updateInfo(userId, payload);
  }
}
