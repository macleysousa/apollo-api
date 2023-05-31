import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';

import { PagamentoTipo } from '../enum/pagamento-tipo.enum';

export class CreateFormaDePagamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 50)
  descricao: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  inicio?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parcelas?: number;

  @ApiProperty({ enum: PagamentoTipo })
  @IsNotEmpty()
  @IsEnum(PagamentoTipo)
  tipo: PagamentoTipo;
}
