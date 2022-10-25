import { IoAdapter } from '@nestjs/platform-socket.io';
// import { getRepository } from 'typeorm';
import { AuthenticatedSocket } from '../utils/interfaces';
// import { Session, User } from '../utils/typeorm';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';


export class WebsocketAdapter extends IoAdapter {
    constructor (
        private readonly jwtService: JwtService,
    ) {
        super();
    }
    
  createIOServer(port: number, options?: any) {
  
    // const sessionRepository = getRepository(Session);
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
        console.log('Inside Websocket Adapter');
      const token = socket.handshake.headers?.access_token;

      if (!token) {
        console.log('Client has no token');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      else {console.log(token); next()}



    //   const { CHAT_APP_SESSION_ID } = cookie.parse(token);
    //   if (!CHAT_APP_SESSION_ID) {
    //     console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
    //     return next(new Error('Not Authenticated'));
    //   }
    //   const signedCookie = cookieParser.signedCookie(
    //     CHAT_APP_SESSION_ID,
    //     process.env.COOKIE_SECRET,
    //   );
    //   if (!signedCookie) return next(new Error('Error signing cookie'));
    //   const sessionDB = await sessionRepository.findOne({ id: signedCookie });
    //   if (!sessionDB) return next(new Error('No session found'));
    //   const userFromJson = JSON.parse(sessionDB.json);
    //   if (!userFromJson.passport || !userFromJson.passport.user)
    //     return next(new Error('Passport or User object does not exist.'));
    //   const userDB = plainToInstance(
    //     User,
    //     JSON.parse(sessionDB.json).passport.user,
    //   );
    //   socket.user = userDB;
    //   next();
    });
    return server;
  }
}
