import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { IsColor } from 'src/commons/validations/is-color.validation';
import { IsReferencia } from 'src/commons/validations/is-referencia.validation';
import { IsTamanho } from 'src/commons/validations/is-tamanho.validation';

import { CreateCodigoBarrasDto } from '../codigo-barras/dto/create-codigo-barras.dto';

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

  @ValidateNested({ each: true })
  @Type(() => CreateCodigoBarrasDto)
  codigoBarras?: CreateCodigoBarrasDto[];
}
