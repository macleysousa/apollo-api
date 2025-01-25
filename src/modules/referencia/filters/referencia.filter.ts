import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ReferenciaBaseFilter } from './referencia-base.filter';

export class ReferenciaFilter extends ReferenciaBaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  nome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  idExterno?: string;
}
