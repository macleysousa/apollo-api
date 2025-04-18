import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CancelTransacaoPontoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  motivoCancelamento?: string;
}
