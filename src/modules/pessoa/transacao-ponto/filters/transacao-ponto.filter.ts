import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { TransacaoTipo, TransacaoTipoEnum } from '../enum/transacao-tipo.enum';

export class TransacaoPontoFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray('int')
  empresaIds?: number[];

  @ApiProperty({ required: false, enum: TransacaoTipoEnum })
  @IsOptional()
  @IsArray('enum', { enum: TransacaoTipoEnum })
  tipos?: TransacaoTipo[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dataTransacaoInicio?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dataTransacaoFim?: Date;
}
