import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsProduto } from 'src/commons/validations/is-produto.validation';

export class AddRemoveBalancoItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsProduto()
  produtoId: number;
}
