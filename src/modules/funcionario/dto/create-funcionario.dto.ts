import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { FuncionarioTipo } from '../enum/funcionario-tipo.enum';

export class CreateFuncionarioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmpresa()
  empresaId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPessoa()
  pessoaId?: number;

  @ApiProperty({ enum: FuncionarioTipo, required: false })
  @IsOptional()
  @IsEnum(FuncionarioTipo)
  tipo?: FuncionarioTipo;
}
