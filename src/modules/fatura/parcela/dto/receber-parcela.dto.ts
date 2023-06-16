import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class ReceberParcelaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(1, 72)
  @IsInt({ message: 'O campo "parcelas" deve ser um inteiro.' })
  parcela: number;

  @ApiProperty()
  @IsNotEmpty()
  //@IsCaixa()
  caixaId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber(undefined, { message: 'O campo "valor" deve ser um número.' })
  valorDesconto: number;
}
