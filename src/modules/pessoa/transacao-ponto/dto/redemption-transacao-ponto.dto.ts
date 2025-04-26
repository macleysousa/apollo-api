import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class RedemptionTransacaoPontoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsBetween(0, 1000000, { message: 'Quantidade deve ser um número positivo' })
  quantidade: number;

  @ApiProperty({ required: false })
  @IsOptional()
  observacao?: string;
}
