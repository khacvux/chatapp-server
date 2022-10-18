import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule, JwtModule.register({
    secret: jwtConstants.secret
  })],
  providers: [ChatService, ChatGateway, JwtService, AuthService]
})
export class ChatModule {}
