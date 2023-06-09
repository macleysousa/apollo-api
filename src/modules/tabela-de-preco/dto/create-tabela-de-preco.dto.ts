import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsBetween } from 'src/commons/validations/is-between.validation';

export class CreateTabelaDePrecoDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @ApiProperty({ required: false, default: 0.9 })
  @IsOptional()
  @IsBetween(0.0, 0.99, { message: 'O terminador deve ser um valor entre 0.0 e 0.99' })
  terminador?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  inativa?: boolean;
}
