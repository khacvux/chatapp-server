import { IoAdapter } from '@nestjs/platform-socket.io';

// import { AuthenticatedSocket } from '../utils/interfaces';

import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPayload } from './types';


export class WebsocketAdapter extends IoAdapter {
	private readonly jwtService: JwtService = new JwtService

	createIOServer(port: number, options?: any) {

		// const sessionRepository = getRepository(Session);
		const server = super.createIOServer(port, options);
		server.use(async (socket: any, next) => {
			console.log('Inside Websocket Adapter');
			const token = socket.handshake.headers?.access_token;
			if (!token) {
				console.log('Client has no token');
				return next(new Error('Not Authenticated. No cookies were sent'));
			}
			console.log(token); 
			try {
				const JWT_SECRET = { secret: jwtConstants.secret };
				const payload:AuthPayload = this.jwtService.verify(token,JWT_SECRET)
				if (!payload.id||!payload.username) {
					return next(new Error('Authenticated fail. token not correct'));
				}
			} catch (err) {
				console.log(err)
				return next(new Error('Authenticated fail. token not correct'));
			}
			next()



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
