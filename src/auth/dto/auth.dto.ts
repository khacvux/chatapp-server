import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthSignIn {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}
export class AuthGetUser {
  @IsNotEmpty()
  @IsString()
  token: string;
}
export class AuthSignUp {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}