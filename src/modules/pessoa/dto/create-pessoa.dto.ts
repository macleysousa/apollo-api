import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsValidDocument } from 'src/commons/validations/is-document.validation';
import { IsBetween } from 'src/commons/validations/is-between.validation';

import { PessoaTipo } from '../enum/pessoa-tipo.enum';
import { IsDocumentoUnique } from '../validation/is-documento-unique.validation';

export class CreatePessoaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsBetween(1, 999, { message: 'O valor deve estar entre 1 e 999' })
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ enum: PessoaTipo })
  @IsNotEmpty()
  @IsEnum(PessoaTipo)
  tipo: PessoaTipo;

  @ApiProperty()
  @IsNotEmpty()
  @IsDocumentoUnique()
  @IsValidDocument()
  documento: string;

  @ApiProperty({ required: false })
  @IsOptional()
  ufInscricaoEstadual?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  inscricaoEstadual?: string;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsOptional()
  nacimento?: Date;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  cliente?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  fornecedor?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  funcionario?: boolean;
}
