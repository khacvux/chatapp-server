import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthSignIn } from './dto';
import { AuthSignUp } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthSignIn) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: AuthSignUp) {
    return this.authService.signup(dto);
  }
}
