import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { MediaType } from 'src/commons/enum/media-type';

const parseOptionalBoolean = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') {
      return true;
    }

    if (normalized === 'false' || normalized === '0') {
      return false;
    }
  }

  return value;
};

export class UploadMediaDto {
  @ApiProperty({ enum: MediaType })
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(parseOptionalBoolean)
  isDefault?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(parseOptionalBoolean)
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;
}
