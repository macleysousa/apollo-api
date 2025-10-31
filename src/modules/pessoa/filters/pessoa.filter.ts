import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { BaseFilter } from 'src/commons/base.filter';
import { IsArray } from 'src/commons/validations/is-array.validation';

export class PessoaFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray('int')
  empresaIds?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  document?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  bloqueado?: boolean;
}
