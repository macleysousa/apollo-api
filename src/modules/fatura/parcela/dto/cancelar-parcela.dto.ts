import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Length } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class CancelarParcelaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(1, 72)
  @IsInt({ message: 'O campo "parcelas" deve ser um inteiro.' })
  parcela: number;

  @ApiProperty()
  @IsNotEmpty()
  //@IsCaixa()
  caixaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 100, { message: 'O campo "motivo" deve ter entre 10 e 100 caracteres.' })
  motivo: string;
}
