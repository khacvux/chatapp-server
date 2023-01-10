import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Routes } from 'src/utils/constants';
import { AddGroupRecipientDto, UpdateAvatarDto } from '../dtos';
import { GroupRecipientService } from '../services/group-recipient.service';

@UseGuards(JwtGuard)
@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientController {
  constructor(
    private eventEmiter: EventEmitter2,
    private service: GroupRecipientService,
  ) {}

  @Post()
  add(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() { recipientId }: AddGroupRecipientDto,
  ) {
    return this.service.addGroupRecipient(userId, groupId, recipientId);
  }

  @Get(Routes.GROUP_RECIPIENT_LEAVE)
  leaveGroup(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) groupId: number,
  ) {
    return this.service.leaveGroup(userId, groupId);
  }

  // @FormDataRequest({ storage: FileSystemStoredFile })
  // @Post('avatar')
  // uploadAvatar(@Body() data: UpdateAvatarDto) {
  //   return this.service.updateAvatar(data);
  // }
}
