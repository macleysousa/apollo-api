import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { EmpresaInclude, EmpresaIncludeEnum } from '../includes/empresa.include';

export class EmpresaFilterBase {
  @ApiPropertyOptional({ enum: EmpresaIncludeEnum, isArray: true })
  @IsOptional()
  @IsArray('enum', { enum: EmpresaIncludeEnum })
  incluir?: EmpresaInclude[];
}
