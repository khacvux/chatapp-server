import { IsNotEmpty, IsNumber } from 'class-validator';
import {
    FileSystemStoredFile,
    HasMimeType,
    IsFile,
    MaxFileSize,
  } from 'nestjs-form-data';

  
export class UpdateAvatarDto {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar: FileSystemStoredFile;
}
