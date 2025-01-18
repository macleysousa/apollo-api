import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { MediaType } from 'src/commons/enum/media-type';

export class UploadMediaDto {
  @ApiProperty({ enum: MediaType })
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ required: false })
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  isPublic?: boolean;
}
