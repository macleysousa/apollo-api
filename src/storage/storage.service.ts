import { PutObjectCommandInput, S3 as S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { basename, extname } from 'path';
import { v7 } from 'uuid';

import { StorageType } from './enum/storage.enum';

const { CLOUDFLARE_R2_ENDPOINT, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_PUBLIC_KEY } =
  process.env;
if (!CLOUDFLARE_R2_ENDPOINT || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY || !CLOUDFLARE_R2_PUBLIC_KEY) {
  throw new Error('Cloudflare R2 credentials not found');
}

@Injectable()
export class StorageService {
  private r2Client: S3Client;
  private r2Bucket: string;

  constructor() {
    this.r2Bucket = process.env.CLOUDFLARE_R2_BUCKET;
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  private async r2Upload(file: Buffer, bucket: any, name: string, mimetype: string): Promise<string> {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    await this.r2Client.putObject(params).catch((error) => {
      throw new BadRequestException(error.message);
    });

    return name;
  }

  async upload(type: StorageType, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file not present in request');
    }

    if (!['image', 'video', 'audio', 'application'].includes(file?.mimetype?.split('/')[0])) {
      throw new BadRequestException('invalid type (accepted types are image, video, audio, pdf)');
    } else if (['application'].includes(file?.mimetype?.split('/')[0]) && !['pdf'].includes(file?.mimetype?.split('/')[1])) {
      throw new BadRequestException('invalid type (accepted types are image, video, audio, pdf)');
    }

    const { originalname } = file;
    const prefix = v7();
    const extension = extname(originalname);
    const nameWithoutExtension = basename(originalname, extension);
    const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9\s]+/g, '-').replace(/\s+/g, '');

    const objectKey = await this.r2Upload(
      file.buffer,
      this.r2Bucket,
      [type, `${prefix}-${sanitizedName}${extension}`].join('/'),
      file.mimetype,
    );

    return objectKey;
  }

  async exists(objectKey: string): Promise<boolean> {
    try {
      await this.r2Client.headObject({
        Bucket: this.r2Bucket,
        Key: objectKey,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
