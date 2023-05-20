import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsColor } from 'src/commons/validations/is-color.validation';
import { IsReference } from 'src/commons/validations/is-reference.validation';
import { IsSize } from 'src/commons/validations/is-size.validation';

export class CreateProdutoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  idExterno?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsColor()
  corId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsSize()
  tamanhoId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsReference()
  referenciaId?: number;
}
