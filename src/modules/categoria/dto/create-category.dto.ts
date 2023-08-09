import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsOptional()
  inativa?: boolean;
}
