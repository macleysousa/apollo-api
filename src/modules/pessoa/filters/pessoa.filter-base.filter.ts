import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { PessoaInclude, PessoaIncludeEnum } from '../includes/pessoa.include';

export class PessoaFilterBase {
  @ApiPropertyOptional({ enum: PessoaIncludeEnum })
  @IsOptional()
  @IsArray()
  incluir?: PessoaInclude[];
}
