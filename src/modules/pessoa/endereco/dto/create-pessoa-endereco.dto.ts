import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { UF } from 'src/commons/enum/uf.enum';

import { EnderecoTipo } from '../enum/endereco-tipo.enum';

export class CreatePessoaEnderecoDto {
  @ApiProperty({ enum: EnderecoTipo })
  @IsNotEmpty()
  @IsEnum(EnderecoTipo)
  tipoEndereco: EnderecoTipo;

  @ApiProperty({ required: false })
  @IsOptional()
  cep?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  logradouro?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  numero?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  complemento?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bairro?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  municipio?: string;

  @ApiProperty({ required: false, enum: UF })
  @IsOptional()
  @IsEnum(UF)
  uf?: UF;

  @ApiProperty({ required: false })
  @IsOptional()
  pais?: string;
}
