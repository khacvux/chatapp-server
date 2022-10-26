import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Router } from 'express';
import { Routes, User } from 'src/utils/constants';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthGetUser, AuthSignIn,AuthSignUp } from './dto';
import { JwtGuard } from './guard';


@Controller(Routes.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post(Routes.SIGN_IN)
  signin(@Body() dto: AuthSignIn) {
    return this.authService.signin(dto);
  }
  
  @Post(Routes.SIGN_UP)
  signup(@Body() dto: AuthSignUp) {
    return this.authService.signup(dto);
  }

  @UseGuards(JwtGuard)
  @Get(Routes.GET_USERS)
  getUser(@GetUser(User.ID) userId: number) {
    return this.authService.getUser(userId);
  }
}
