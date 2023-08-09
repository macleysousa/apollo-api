import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { IsMarca } from 'src/commons/validations/is-marca.validation';

import { CreateCodigoBarrasDto } from '../codigo-barras/dto/create-codigo-barras.dto';
import { Type } from 'class-transformer';

export class ImportProdutoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "referenciaId" é obrigatório.' })
  referenciaId: number;

  @ApiProperty()
  @IsOptional()
  referenciaIdExterno?: string;

  @ApiProperty()
  @IsOptional()
  referenciaNome?: string;

  @ApiProperty({ enum: UnidadeMedida })
  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidadeMedida?: UnidadeMedida;

  @ApiProperty({ required: false })
  @IsOptional()
  categoriaNome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  subCategoriaNome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMarca({ message: 'Marca inválida.' })
  marcaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  composicao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  cuidados?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoId" é obrigatório.' })
  produtoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "produtoIdExterno" é obrigatório.' })
  produtoIdExterno: string;

  @ApiProperty({ required: false })
  @IsOptional()
  corNome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tamanhoNome?: string;

  @ApiProperty({ type: [CreateCodigoBarrasDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCodigoBarrasDto)
  codigoBarras?: CreateCodigoBarrasDto[];
}
