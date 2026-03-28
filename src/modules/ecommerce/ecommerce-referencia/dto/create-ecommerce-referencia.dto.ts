import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';
import { IsReferencia } from 'src/commons/validations/is-referencia.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

export class CreateEcommerceReferenciaDto {
  @ApiPropertyOptional({ description: 'ID da empresa' })
  @IsOptional()
  @IsEmpresa()
  empresaId: number;

  @ApiProperty({ description: 'ID da referência' })
  @IsNotEmpty()
  @IsReferencia()
  referenciaId: number;

  @ApiProperty({ description: 'ID da tabela de preço' })
  @IsNotEmpty()
  @IsTabelaDePreco()
  tabelaDePrecoId: number;

  @ApiProperty({ description: 'Indica se é um rascunho' })
  @IsNotEmpty()
  @IsBoolean()
  rascunho: boolean;
}
