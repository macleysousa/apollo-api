import { PutObjectCommandInput, S3 as S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { basename, extname } from 'path';

import { StorageType } from './enum/storage.enum';

@Injectable()
export class StorageService {
  private r2Client: S3Client | null = null;
  private r2Bucket: string | null = null;

  constructor() {
    const { CLOUDFLARE_R2_ENDPOINT, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET } =
      process.env;

    if (!CLOUDFLARE_R2_ENDPOINT || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY || !CLOUDFLARE_R2_BUCKET) {
      return;
    }

    this.r2Bucket = CLOUDFLARE_R2_BUCKET;
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  private ensureR2Configured() {
    if (!this.r2Client || !this.r2Bucket) {
      throw new BadRequestException('Cloudflare R2 nao configurado');
    }
  }

  private async r2Upload(file: Buffer, bucket: any, name: string, mimetype: string): Promise<string> {
    this.ensureR2Configured();

    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    await this.r2Client!.putObject(params).catch((error) => {
      throw new BadRequestException(error.message);
    });

    return name;
  }

  async upload(type: StorageType, file: Express.Multer.File) {
    this.ensureR2Configured();

    if (!file) {
      throw new BadRequestException('file not present in request');
    }

    if (!['image', 'video', 'audio', 'application'].includes(file?.mimetype?.split('/')[0])) {
      throw new BadRequestException('invalid type (accepted types are image, video, audio, pdf)');
    } else if (['application'].includes(file?.mimetype?.split('/')[0]) && !['pdf'].includes(file?.mimetype?.split('/')[1])) {
      throw new BadRequestException('invalid type (accepted types are image, video, audio, pdf)');
    }

    const { originalname } = file;
    const prefix = randomUUID();
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

  async delete(objectKey: string): Promise<void> {
    this.ensureR2Configured();
    await this.r2Client!.deleteObject({ Bucket: this.r2Bucket!, Key: objectKey });
  }

  async exists(objectKey: string): Promise<boolean> {
    this.ensureR2Configured();

    try {
      await this.r2Client!.headObject({
        Bucket: this.r2Bucket!,
        Key: objectKey,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
