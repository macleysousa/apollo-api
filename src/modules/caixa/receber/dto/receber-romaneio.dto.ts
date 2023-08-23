import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';

import { PagamentoDto } from './pagamento.dto';

export class ReceberRomaneioDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsRomaneio(SituacaoRomaneio.EmAndamento, { message: 'Romaneio não está Em Andamento' })
  romaneioId: number;

  @ApiProperty({ type: [PagamentoDto] })
  @IsOptional()
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma forma de pagamento.' })
  @ValidateNested({ each: true })
  @Type(() => PagamentoDto)
  formasDePagamento?: PagamentoDto[];

  @ApiProperty({ type: [Number] })
  @IsOptional()
  @IsRomaneio(SituacaoRomaneio.Encerrado, { each: true })
  romaneiosDevolucao?: number[];
}
