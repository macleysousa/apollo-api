import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

export class CreateFaturaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber(undefined, { message: 'O campo "valor" deve ser um número.' })
  valor: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(500, { message: 'O campo "observacao" deve ter no máximo 500 caracteres.' })
  observacao: string;
}
