import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { EmpresaFilterBase } from './empresa-filter-base';

export class EmpresaFilter extends EmpresaFilterBase {
  @ApiPropertyOptional({ description: 'Termo para busca no nome ou cnpj da empresa' })
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Buscar por IDs das empresas', type: [Number] })
  @IsOptional()
  @IsArray('int')
  ids?: number[];
}
