import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSignIn, AuthSignUp } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from 'src/chat/gateway/types';
import { match } from 'assert';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }
  async signin(dto: AuthSignIn) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (!user) return {status: false,msg:"Incorrect Username or Password"}
    const pwMatches = await argon.verify(user.hash, dto.password).catch(_ => { return false });
    if (pwMatches) {
      return this.signToken(user.id, user.username);
    } else return {status: pwMatches,msg:"Incorrect Username or Password"}
  }

  async checkUser(payload: AuthPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id
      },
    });
    if (user.username != payload.username) {
      return false
    }
    return true
  }

  async signup(dto: AuthSignUp) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
        },
      });
      return this.signToken(user.id, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credientials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ status: boolean, access_token: string,id: number,username: string, }> {
    const payload = {
      id: userId,
      username: username,
    };
    const secret = this.config.get('SECRET_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return {
      status: true,
      access_token: token,
      id: userId,
      username:username
    };
  }
}
