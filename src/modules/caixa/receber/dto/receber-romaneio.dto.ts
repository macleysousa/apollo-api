import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';

import { PagamentoDto } from './pagamento.dto';

export class ReceberRomaneioDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsRomaneio({ situacao: ['em_andamento'] }, { message: 'Romaneio não está Em Andamento' })
  romaneioId: number;

  @ApiPropertyOptional({ type: [PagamentoDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PagamentoDto)
  formasDePagamento?: PagamentoDto[];

  constructor(partial?: Partial<ReceberRomaneioDto>) {
    Object.assign(this, partial);
  }
}
