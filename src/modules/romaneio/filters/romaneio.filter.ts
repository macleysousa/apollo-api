import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { RomaneioIncludeEnum } from '../includes/romaneio.include';

import { RomaneioFilterBase } from './romaneio.filter-base';

export class RomaneioFilter extends RomaneioFilterBase {
  @ApiProperty({ type: Date, format: 'date', required: false })
  @IsOptional()
  dataInicial?: Date;

  @ApiProperty({ type: Date, format: 'date', required: false })
  @IsOptional()
  dataFinal?: Date;

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsArray({ message: 'O campo empresaIds deve ser um array de números.' })
  @IsOptional()
  empresaIds?: number[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsArray({ message: 'O campo empresaIds deve ser um array de números.' })
  @IsOptional()
  pessoaIds?: number[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  funcionarioIds?: number[];

  @ApiProperty({ enum: ModalidadeRomaneio, isArray: true, required: false })
  @IsOptional()
  @IsEnum(ModalidadeRomaneio, { each: true })
  modalidades?: (keyof typeof ModalidadeRomaneio)[];

  @ApiProperty({ enum: OperacaoRomaneio, isArray: true, required: false })
  @IsOptional()
  @IsEnum(OperacaoRomaneio, { each: true })
  operacoes?: (keyof typeof OperacaoRomaneio)[];

  @ApiProperty({ enum: SituacaoRomaneio, isArray: true, required: false })
  @IsOptional()
  @IsEnum(SituacaoRomaneio, { each: true })
  situacoes?: (keyof typeof SituacaoRomaneio)[];
}
