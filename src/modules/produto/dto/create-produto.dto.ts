import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsColor } from 'src/commons/validations/is-color.validation';
import { IsReferencia } from 'src/commons/validations/is-referencia.validation';
import { IsTamanho } from 'src/commons/validations/is-tamanho.validation';

export class CreateProdutoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsReferencia()
  referenciaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  idExterno?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsColor()
  corId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsTamanho()
  tamanhoId?: number;
}
