import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBalancoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
