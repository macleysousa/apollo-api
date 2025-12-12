import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { IsDateOnly } from 'src/commons/validations/is-date-only';
import { IsValidDocument } from 'src/commons/validations/is-document.validation';
import { IsPhoneNumber } from 'src/commons/validations/is-phone-number.validation';

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
  @IsPhoneNumber({ message: 'O número de telefone informado não é válido.' })
  telefone?: string;
}
