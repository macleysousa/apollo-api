import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

import { IsProduto } from 'src/commons/validations/is-produto.validation';

export class AddRemoveBalancoLoteItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsProduto()
  produtoId: number;

  @ApiProperty({ default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantidadeContada: number;
}
