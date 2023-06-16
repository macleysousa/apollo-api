import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class UpsertParcelaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(1, 72)
  @IsInt({ message: 'O campo "parcelas" deve ser um inteiro.' })
  parcela: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(0.01, 999999)
  @IsNumber(undefined, { message: 'O campo "valor" deve ser um número.' })
  valor: number;

  @ApiProperty({ type: String, format: 'date' })
  @IsNotEmpty()
  @IsDateString(undefined, { message: 'O campo "vencimento" deve ser uma data válida.' })
  vencimento: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber(undefined, { message: 'O campo "valor" deve ser um número.' })
  valorDesconto: number;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @MaxLength(400, { message: 'O campo "observacao" deve ter no máximo 400 caracteres.' })
  observacao: string;
}
