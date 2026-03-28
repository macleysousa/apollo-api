import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

export class EstoqueFilter {
  @ApiPropertyOptional({ description: 'IDs das empresas para filtrar o estoque', type: [Number] })
  @IsOptional()
  @IsArray('int')
  empresaIds?: number[];

  @ApiPropertyOptional({ description: 'IDs das referências para filtrar o estoque', type: [Number] })
  @IsOptional()
  @IsArray('int')
  referenciaIds?: number[];

  @ApiPropertyOptional({ description: 'IDs externos das referências para filtrar o estoque', type: [String] })
  @IsOptional()
  @IsArray('string')
  referenciaIdExternos?: string[];

  @ApiPropertyOptional({ description: 'IDs dos produtos para filtrar o estoque', type: [Number] })
  @IsOptional()
  @IsArray('int')
  produtoIds?: number[];

  @ApiPropertyOptional({ description: 'IDs externos dos produtos para filtrar o estoque', type: [String] })
  @IsOptional()
  @IsArray('string')
  produtoIdExternos?: string[];

  @ApiPropertyOptional({ description: 'IDs das cores para filtrar o estoque', type: [Number] })
  @IsOptional()
  @IsArray('int')
  corIds?: number[];

  @ApiPropertyOptional({ description: 'IDs dos tamanhos para filtrar o estoque', type: [Number] })
  @IsOptional()
  @IsArray('int')
  tamanhoIds?: number[];

  @ApiPropertyOptional({ description: 'Inicio da data da ultima atualização', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  ultimaAtualizacaoInicio?: Date;

  @ApiPropertyOptional({ description: 'Fim da data da ultima atualização', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  ultimaAtualizacaoFim?: Date;

  @ApiPropertyOptional({ description: 'Número da página para paginação', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Número de itens por página para paginação', default: 100 })
  @IsOptional()
  limit?: number = 100;
}
