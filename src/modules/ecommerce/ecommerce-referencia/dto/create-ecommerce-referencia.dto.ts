import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

import { IsReferencia } from 'src/commons/validations/is-referencia.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

export class CreateEcommerceReferenciaDto {
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
