import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTamanhoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'O campo "id" deve ser um número inteiro' })
  id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "nome" é obrigatório' })
  nome: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean({ message: 'O campo "inativo" deve ser um booleano' })
  inativo?: boolean;
}
