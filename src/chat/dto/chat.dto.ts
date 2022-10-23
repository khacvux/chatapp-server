import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AuthGetChat {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  to: number;
}
