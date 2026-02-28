import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

export class RedemptionTransacaoPontoDto {
  @ApiPropertyOptional({
    description: 'ID da empresa para qual os pontos serão resgatados. Se não informado, será considerada a empresa do contexto.',
  })
  @IsOptional()
  empresaId?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsBetween(0, 1000000, { message: 'Quantidade deve ser um número positivo' })
  quantidade: number;

  @ApiPropertyOptional({
    description: 'Observação sobre o resgate de pontos.',
  })
  @IsOptional()
  observacao?: string;
}
