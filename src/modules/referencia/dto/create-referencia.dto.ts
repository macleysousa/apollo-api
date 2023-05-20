import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { IsSubCategory } from 'src/commons/validations/is-category-sub.validation';
import { IsCategory } from 'src/commons/validations/is-category.validation';

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

  @ApiProperty({ enum: UnidadeMedida })
  @IsOptional()
  unidadeMedida: UnidadeMedida;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsCategory()
  categoriaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsSubCategory()
  subCategoriaId?: number;
}
