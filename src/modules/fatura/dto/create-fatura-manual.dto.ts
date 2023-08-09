import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { FaturaParcelaEntity } from '../parcela/entities/parcela.entity';

export class CreateFaturaManualDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(0.01, 999999)
  @IsNumber(undefined, { message: 'O campo "valor" deve ser um número.' })
  valor: number;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsBetween(1, 72)
  @IsInt({ message: 'O campo "parcelas" deve ser um inteiro.' })
  parcelas: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(500, { message: 'O campo "observacao" deve ter no máximo 500 caracteres.' })
  observacao?: string;

  @Exclude()
  @IsOptional()
  itens?: FaturaParcelaEntity[];
}
