import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { SituacaoPedido, SituacaoPedidoType } from '../enum/situacao-pedido.enum';
import { TipoPedido, TipoPedidoType } from '../enum/tipo-pedido.enum';

export class PedidoFilter {
  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsArray({ message: 'O campo empresaIds deve ser um array de números.' })
  @IsOptional()
  empresaIds?: number[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsArray({ message: 'O campo empresaIds deve ser um array de números.' })
  @IsOptional()
  pessoaIds?: number[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  funcionarioIds?: number[];

  @ApiProperty({ enum: SituacaoPedido, isArray: true, required: false })
  @IsOptional()
  @IsEnum(SituacaoPedido, { each: true })
  situacoes?: SituacaoPedidoType[] | SituacaoPedido[];

  @ApiProperty({ enum: TipoPedido, isArray: true, required: false })
  @IsOptional()
  @IsEnum(TipoPedido, { each: true })
  tipos?: TipoPedidoType[] | TipoPedido[];
}
