import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { FuncionarioTipo } from '../enum/funcionario-tipo.enum';

export class CreateFuncionarioDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmpresa()
  empresaId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsOptional()
  @IsPessoa()
  pessoaId?: number;

  @ApiProperty({ enum: FuncionarioTipo })
  @IsOptional()
  @IsEnum(FuncionarioTipo)
  tipo?: FuncionarioTipo;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  inativo?: boolean;
}
