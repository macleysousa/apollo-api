import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';

import { TipoDocumento } from '../enum/tipo-documento.enum';
import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';

export class LancarMovimentoPessoaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPessoa()
  pessoaId: number;

  @ApiProperty({ enum: TipoDocumento })
  @IsNotEmpty()
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento;

  @ApiProperty({ enum: TipoMovimento })
  @IsNotEmpty()
  @IsEnum(TipoMovimento)
  tipoMovimento: TipoMovimento;

  @ApiProperty()
  @IsNotEmpty()
  @IsBetween(0, 9999999999)
  valor: number;

  @ApiProperty()
  @IsNotEmpty()
  liquidacao: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  faturaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  faturaParcela: number;

  @ApiProperty()
  @IsOptional()
  @IsRomaneio()
  romaneioId?: number;

  @ApiProperty()
  @IsOptional()
  observacao?: string;

  constructor(data: LancarMovimentoPessoaDto) {
    Object.assign(this, data);
  }
}
