import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

export class EcommerceReferenciaFilters {
  @ApiPropertyOptional({ description: 'IDs do e-commerce' })
  @IsOptional()
  @IsArray('int')
  ids?: number[];

  @ApiPropertyOptional({ description: 'IDs das Empresas' })
  @IsOptional()
  @IsArray('int')
  empresaIds?: number[];

  @ApiPropertyOptional({ description: 'IDs das Referências' })
  @IsOptional()
  @IsArray('int')
  referenciaIds?: number[];

  @ApiPropertyOptional({ description: 'IDs das Categorias' })
  @IsOptional()
  @IsArray('int')
  categoriaIds?: number[];

  @ApiPropertyOptional({ description: 'Termo de busca' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Indica se a busca deve retornar que esta como rascunho ou não', default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  rascunho?: boolean;

  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Número de itens por página', default: 100 })
  @IsOptional()
  limit?: number;
}
