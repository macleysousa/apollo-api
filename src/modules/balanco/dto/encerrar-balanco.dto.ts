import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EncerrarBalancoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
