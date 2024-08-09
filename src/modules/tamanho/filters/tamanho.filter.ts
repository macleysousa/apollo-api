import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TamanhoFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  nome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  inativo?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  cache?: boolean;
}
