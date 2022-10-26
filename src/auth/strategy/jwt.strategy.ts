import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Secret } from 'src/utils/constants';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(Secret.JWT_SECRET),
    });
  }

  async validate(payload: { id: number; username: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    delete user.hash;
    return user;
  }
}
