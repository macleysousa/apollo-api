import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { BaseFilter } from 'src/commons/base.filter';
import { IsArray } from 'src/commons/validations/is-array.validation';

import { PessoaInclude, PessoaIncludeEnum } from '../includes/pessoa.include';

export class PessoaFilter extends BaseFilter {
  @ApiPropertyOptional()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({ isArray: true })
  @IsOptional()
  @IsArray('int')
  empresaIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  document?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  bloqueado?: boolean;

  @ApiPropertyOptional({ enum: PessoaIncludeEnum, isArray: true })
  @IsOptional()
  @IsArray('enum', { enum: PessoaIncludeEnum })
  incluir?: PessoaInclude[];
}
