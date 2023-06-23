import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MinLength } from 'class-validator';

import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

export class CancelarAdiantamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt({ message: 'O liquidacao deve ser um número inteiro' })
  liquidacao: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'O motivo deve ter no mínimo 3 caracteres' })
  motivo: string;
}
