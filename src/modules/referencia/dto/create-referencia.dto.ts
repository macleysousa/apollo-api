import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { IsSubCategoria } from 'src/commons/validations/is-categoria-sub.validation';
import { IsCategoria } from 'src/commons/validations/is-categoria.validation';
import { IsMarca } from 'src/commons/validations/is-marca.validation';
import { ImportPrecoDto } from 'src/modules/tabela-de-preco/referencia/dto/import-precos.dto';

export class CreateReferenciaDto {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  idExterno?: string;

  @ApiProperty({ enum: UnidadeMedida, required: false })
  @IsOptional()
  unidadeMedida?: UnidadeMedida;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsCategoria()
  categoriaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsSubCategoria()
  subCategoriaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMarca()
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

  @ApiProperty({ type: [ImportPrecoDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImportPrecoDto)
  @IsArray({ message: 'O campo "precos" deve ser um array.' })
  precos?: ImportPrecoDto[];
}
