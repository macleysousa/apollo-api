import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ContagemItemDto } from './contagem-item.dto';

export class CreateCaixaContagemDto {
  @ApiPropertyOptional()
  @IsOptional()
  observacao?: string;

  @ApiProperty({ type: [ContagemItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ContagemItemDto)
  items: ContagemItemDto[];
}
