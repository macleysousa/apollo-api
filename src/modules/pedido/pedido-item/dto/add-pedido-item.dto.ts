import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsProduto } from 'src/commons/validations/is-produto.validation';

export class AddPedidoItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoId" é obrigatório' })
  @IsProduto()
  produtoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "quantidade" é obrigatório' })
  @IsBetween(0.001, 999, { message: 'A "quantidade" deve ser entre 0.001 e 999' })
  quantidade: number;
}
