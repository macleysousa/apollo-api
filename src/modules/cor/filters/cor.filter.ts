import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CorFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  nome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  inativa?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  cache?: boolean;
}
