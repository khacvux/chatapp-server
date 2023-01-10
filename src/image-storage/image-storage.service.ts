import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileSystemStoredFile } from 'nestjs-form-data';

@Injectable()
export class ImageStorageService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUNDINARY_NAME'),
      api_key: config.get<string>('CLOUNDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUNDINARY_API_SECRET'),
    });
  }

  uploadImage(file: FileSystemStoredFile): Promise<{
    success: boolean;
    url?: string;
    error?: Error;
    publicId?: string;
  }> {
    try {
      return new Promise((resolve) =>
        cloudinary.uploader.upload(
          file.path,
          (error: Error, res: { secure_url: string; public_id: string }) => {
            return resolve({
              success: error ? false : true,
              url: res?.secure_url,
              error,
              publicId: res?.public_id,
            });
          },
        ),
      );
    } catch (error) {
      return error;
    }
  }

  removeImage(publicID: string) {
    try {
      return cloudinary.uploader.destroy(publicID);
    } catch (error) {
      return error;
    }
  }
}
