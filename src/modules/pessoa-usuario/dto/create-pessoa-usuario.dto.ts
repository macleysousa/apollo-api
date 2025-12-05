import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { IsDateOnly } from 'src/commons/validations/is-date-only';
import { IsValidDocument } from 'src/commons/validations/is-document.validation';

export class CreatePessoaUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  empresaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  nome: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  sobrenome: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  senha: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo {0} é obrigatório.' })
  @IsValidDocument({ message: 'O CPF/CNPJ informado não é válido.' })
  documento: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateOnly()
  dataNascimento?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'O telefone deve estar no formato +[código do país][número] (ex: +5588999999999)' })
  telefone?: string;
}
