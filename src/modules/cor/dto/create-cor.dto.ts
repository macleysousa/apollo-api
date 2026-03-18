import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'O campo "id" deve ser um número inteiro' })
  id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "nome" é obrigatório' })
  nome: string;

  @ApiProperty({ required: false, description: 'Codigo hexadecimal no formato #RRGGBB ou #RRGGBBAA' })
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, {
    message: 'O campo "hex" deve estar no formato #RRGGBB ou #RRGGBBAA',
  })
  hex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'O campo "nomeInternacional" deve ser uma string' })
  nomeInternacional?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'O campo "base" deve ser uma string' })
  base?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray({ message: 'O campo "tags" deve ser uma lista de strings' })
  @IsString({ each: true, message: 'Cada item de "tags" deve ser uma string' })
  tags?: string[];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean({ message: 'O campo "inativa" deve ser um booleano' })
  inativa?: boolean;
}
