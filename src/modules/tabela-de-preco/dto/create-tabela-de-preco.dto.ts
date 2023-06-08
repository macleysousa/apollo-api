import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateTabelaDePrecoDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  inativa?: boolean;
}
