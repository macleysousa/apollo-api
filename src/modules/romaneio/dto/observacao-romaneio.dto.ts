import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class OperacaoRomaneioDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  observacao: string;
}
