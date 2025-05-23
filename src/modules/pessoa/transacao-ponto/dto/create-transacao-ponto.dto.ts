import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class CreateTransacaoPontoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsBetween(0, 1000000, { message: 'Quantidade deve ser um número positivo' })
  quantidade: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Validade deve ser uma data válida' })
  @IsDateString()
  validaAte: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  observacao?: string;
}
