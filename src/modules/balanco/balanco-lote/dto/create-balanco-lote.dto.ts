import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBalancoLoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lote: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
