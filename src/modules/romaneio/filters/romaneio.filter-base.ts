import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { RomaneioIncludeEnum } from '../includes/romaneio.include';

export class RomaneioFilterBase {
  @ApiProperty({ enum: RomaneioIncludeEnum, isArray: true, required: false })
  @IsOptional()
  @IsArray('enum', { enum: RomaneioIncludeEnum })
  incluir?: (keyof typeof RomaneioIncludeEnum)[];
}
