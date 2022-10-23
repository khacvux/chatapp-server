import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthGetUser, AuthSignIn } from './dto';
import { AuthSignUp } from './dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthSignIn) {
    return this.authService.signin(dto);
  }
  @Post('getusers')
  getUser(@Body() dto: AuthGetUser) {
    return this.authService.getUser(dto);
  }

  @Post('signup')
  signup(@Body() dto: AuthSignUp) {
    return this.authService.signup(dto);
  }

  // @Get('test')
  // @UseGuards(JwtGuard)
  // testApi(@GetUser() user) {
  //      return user
  // }
}
