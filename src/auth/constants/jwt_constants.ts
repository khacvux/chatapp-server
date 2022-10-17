import { ConfigService } from '@nestjs/config';

export class jwtConstants {
    static secret: string | Buffer;
    constructor(config: ConfigService) {
        jwtConstants.secret = config.get('JWT_SECRET')
    }
}
