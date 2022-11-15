import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { GroupService } from './group.service';
import { CreateGroupDto, TransferOwnerDto, UpdateGroupDetalDto } from './dtos';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller(Routes.GROUP)
export class GroupController {
  constructor(private service: GroupService) {}

  @Get(Routes.GET_GROUPS)
  getGroups(@GetUser('id') userId: number) {
    return this.service.getGroups(userId);
  }

  @Get(Routes.GET_GROUP)
  getGroup(@Param('id', ParseIntPipe) groupId: number) {
    return this.service.getGroup(groupId);
  }

  @Post(Routes.CREATE_GROUP)
  createGroup(@GetUser() user: User, @Body() payload: CreateGroupDto) {
    return this.service.createGroup(user, payload);
  }

  @Post(Routes.UPDATE_GROUP_OWNER)
  updateGroupOwner(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    return this.service.updateGroupOwner(userId, groupId, newOwnerId);
  }

  @Post(Routes.UPDATE_GROUP_DETAIL)
  updateGroupDetails(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() payload: UpdateGroupDetalDto,
  ) {
    return this.service.updateGroupDetails(groupId, payload);
  }
}
