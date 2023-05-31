import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateFormaDePagamentoDto } from './create-forma-de-pagamento.dto';

export class UpdateFormaDePagamentoDto extends PartialType(CreateFormaDePagamentoDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  inativa?: boolean;
}
