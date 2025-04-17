import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  pagina?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  itemsPorPagina?: number;

  constructor() {
    this.pagina = this.pagina ?? 1;
    this.itemsPorPagina = this.itemsPorPagina ?? 100;
  }
}
