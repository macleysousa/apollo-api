import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { ReferenciaInclude, ReferenciaIncludeEnum } from '../includes/referencia.include';

export class ReferenciaBaseFilter {
  @ApiProperty({ enum: ReferenciaIncludeEnum, isArray: true, required: false })
  @IsOptional()
  @IsArray('enum', { enum: ReferenciaIncludeEnum })
  incluir?: ReferenciaInclude[];
}
