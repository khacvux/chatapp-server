import { Chat } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthSignIn {
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class AuthGetUser {
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class AuthSignUp {
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export interface IAuthReturn{
  statusCode: number;
  message?: string;
  data?:IAuthSuccessReturn;
  users?:IAuthUsers[];
  error?: string;
}
export interface IAuthSuccessReturn{
  access_token:string;
  user:IAuthUser
}
export interface IAuthUser{
  id: number;
  username: string;
}
export interface IAuthUsers{
  id: number;
  username: string;
  chatFrom?: Chat[];
  chatTo?: Chat[];
  chat?: Chat[];
}
