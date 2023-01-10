import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
