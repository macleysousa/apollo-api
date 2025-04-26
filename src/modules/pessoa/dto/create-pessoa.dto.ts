import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { IsValidDocument } from 'src/commons/validations/is-document.validation';

import { ContatoTipo } from '../enum/contato-tipo.enum';
import { PessoaTipo } from '../enum/pessoa-tipo.enum';
import { IsDocumentoUnique } from '../validation/is-documento-unique.validation';

export class CreatePessoaDto {
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
  nascimento?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, enum: ContatoTipo })
  @IsOptional()
  @IsEnum(ContatoTipo)
  tipoContato?: ContatoTipo;

  @ApiProperty({ required: false })
  @IsOptional()
  contato?: string;

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
