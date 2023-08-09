import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'O campo "id" deve ser um número inteiro' })
  id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "nome" é obrigatório' })
  nome: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean({ message: 'O campo "inativa" deve ser um booleano' })
  inativa?: boolean;
}
