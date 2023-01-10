import { Module } from '@nestjs/common';
import { GroupRecipientController } from './controllers/group-recipient.controller';
import { GroupController } from './controllers/group.controller';
import { GroupRecipientService } from './services/group-recipient.service';
import { GroupService } from './services/group.service';

@Module({
  controllers: [GroupController, GroupRecipientController],
  providers: [GroupService, GroupRecipientService],
})
export class GroupModule {}
