import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';
import { FriendsModule } from './friends/friends.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { GroupModule } from './group/group.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { ImageStorageModule } from './image-storage/image-storage.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestjsFormDataModule,
    PrismaModule,
    AuthModule,
    ChatModule,
    GatewayModule,
    FriendsModule,
    FriendRequestModule,
    GroupModule,
    UserModule,
    ImageStorageModule,
  ],
})
export class AppModule {}
