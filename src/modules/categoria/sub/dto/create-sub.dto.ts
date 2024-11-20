import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsCategoria } from 'src/commons/validations/is-categoria.validation';

export class CreateSubCategoriaDto {
  @Exclude()
  @IsOptional()
  @IsCategoria()
  categoriaId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  inativa?: boolean;
}
