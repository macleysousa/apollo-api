import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { IsSubCategoria } from 'src/commons/validations/is-categoria-sub.validation';
import { IsCategoria } from 'src/commons/validations/is-categoria.validation';
import { IsMarca } from 'src/commons/validations/is-marca.validation';

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
  marcaId: number;
}
