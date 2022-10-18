import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { AuthPayload, SocketWithAuth } from '../gateway/types';

@Injectable()
export class GatewayGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket: SocketWithAuth = context.switchToWs().getClient();
        const token =
            socket.handshake.auth.access_token || socket.handshake.headers['access_token'];
        if (!token) {
            socket.disconnect()
            throw new ForbiddenException('No token provided').message;
        }
        try {
            const JWT_SECRET = { secret: jwtConstants.secret }
            var payload:any
            try {
                payload = this.jwtService.verify(token,JWT_SECRET);
            } catch {
                socket.disconnect()
                throw new ForbiddenException('The token provided is not correct').message;
            }
            
            const user = await this.authService.checkUser(payload)

            if (!user) throw new ForbiddenException('The token provided is not correct').message;
            return true;
        } catch {
            throw new ForbiddenException('The token provided is not correct').message;
        }
    }
}
