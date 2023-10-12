import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsFuncionario } from 'src/commons/validations/is-funcionario.validation';
import { IsPessoa } from 'src/commons/validations/is-pessoa.validation';
import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

import { TipoPedido, TipoPedidoType } from '../enum/tipo-pedido.enum';

export class CreatePedidoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "pessoaId" é obrigatório' })
  @IsPessoa()
  pessoaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "funcionarioId" é obrigatório' })
  @IsFuncionario()
  funcionarioId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "tabelaPrecoId" é obrigatório' })
  @IsTabelaDePreco()
  tabelaPrecoId: number;

  @ApiProperty({ format: 'date' })
  @IsNotEmpty({ message: 'O campo "dataBasePagamento" é obrigatório' })
  dataBasePagamento: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "parcelas" é obrigatório' })
  @IsBetween(1, 999, { message: 'Parcelas deve ser entre 1 e 999' })
  parcelas: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "intervalo" é obrigatório' })
  @IsBetween(1, 360, { message: 'Intervalo deve ser entre 1 e 360' })
  intervalo: number;

  @ApiProperty({ format: 'date' })
  @IsOptional()
  previsaoDeFaturamento?: Date;

  @ApiProperty({ format: 'date' })
  @IsOptional()
  @IsDate({ message: 'O campo "dataBasePagamento" deve ser uma data válida' })
  previsaoDeEntrega?: Date;

  @ApiProperty({ enum: TipoPedido, default: TipoPedido.transferencia_saida })
  @IsNotEmpty({ message: 'O campo "tipo" é obrigatório' })
  @IsEnum(TipoPedido)
  tipo: TipoPedidoType | TipoPedido;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'O campo "fiscal" deve ser um booleano' })
  fiscal?: boolean;

  @ApiProperty()
  @IsOptional()
  @MaxLength(254, { message: 'Observação deve ter menos de 254 caracteres' })
  observacao?: string;
}
