import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSignIn, AuthSignUp, IAuthReturn, IAuthSuccessReturn, IAuthUsers } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Secret, Token } from 'src/utils/constants';
import { Chat } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) { }

	async signin(dto: AuthSignIn): Promise<IAuthReturn> {
		const user = await this.prisma.user.findUnique({
			where: {
				username: dto.username,
			},
		});
		const AuthReturn: IAuthReturn = {
			statusCode: 400,
			message: "Incorrect Username or Password",
			error: "Bad Request"
		}
		if (!user) {
			return AuthReturn
		}
		const pwMatches = await argon.verify(user.hash, dto.password).catch(_ => { return false });
		if (pwMatches) {
			return this.signToken(user.id, user.username);
		} else return AuthReturn
	}

	async signup(dto: AuthSignUp): Promise<IAuthReturn> {
		const hash = await argon.hash(dto.password);
		const AuthReturn: IAuthReturn = {
			statusCode: 400,
			message: "Username or Email already used",
			error: "Bad Request"
		}
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
					// throw new ForbiddenException('Credientials taken');
					return AuthReturn
				}
			}
			// throw error;
			return AuthReturn
		}
	}

	async signToken(
		userId: number,
		username: string,
	): Promise<IAuthReturn> {
		const payload = {
			id: userId,
			username: username,
		};
		const secret = this.config.get(Secret.JWT_SECRET);

		const token = await this.jwt.signAsync(payload, {
			expiresIn: Token.EXPIRES_IN,
			secret,
		});

		return {
			statusCode: 200,
			data: {
				access_token: token,
				user: {
					id: userId,
					username: username
				}
			}
		}
	}

	async getUser(userId: number): Promise<IAuthReturn> {
		const users: IAuthUsers[] = await this.prisma.user.findMany({
			orderBy: {
				chatFrom: {
					_count: 'desc'
				}
			},
			where: {
				NOT: {
					id: userId
				}
			},
			select: {
				id: true,
				username: true,
				chatFrom : {
					take: 1,
					orderBy: [
						{ id: 'desc' }
					],
					where: {
						OR: [
							{ from: userId },
							{ to: userId }
						]
					}
				},
				chatTo: {
					take: 1,
					orderBy: [
						{ id: 'desc' }
					],
					where: {
						OR: [
							{ from: userId },
							{ to: userId }
						]
					}
				}
			}
		});

		users.map((user) => {
			if (user.chatTo[0]) {
				if(user.chatFrom[0]){
					if (user.chatFrom[0].createdAt>=user.chatTo[0].createdAt) {
						user['chat'] = user.chatFrom
					}else user['chat'] = user.chatTo
				}else user['chat'] = user.chatTo
			}
			delete user.chatFrom
			delete user.chatTo
		})

		return { statusCode: 200, users: users }
	}
}
