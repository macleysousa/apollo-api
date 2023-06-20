import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsFormaPagamento } from 'src/commons/validations/is-forma-pagamento.validation';

export class PagamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  controle: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsFormaPagamento()
  formaDePagamentoId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsBetween(1, 72, { message: 'O número de parcelas deve ser entre 1 e 72.' })
  parcela: number;

  @ApiProperty()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({ type: Date, format: 'date', required: false })
  @IsOptional()
  vencimento: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  banco: string;

  @ApiProperty({ required: false })
  @IsOptional()
  agencia: string;

  @ApiProperty({ required: false })
  @IsOptional()
  conta: string;

  @ApiProperty({ required: false })
  @IsOptional()
  documento: string;

  @ApiProperty({ required: false })
  @IsOptional()
  nsu: string;

  @ApiProperty({ required: false })
  @IsOptional()
  autorizacao: string;

  @ApiProperty({ required: false })
  @IsOptional()
  cheque: number;

  @ApiProperty({ required: false })
  @IsOptional()
  banda: string;

  @ApiProperty({ required: false })
  @IsOptional()
  chequerTerceiro: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  cpfCnpjTerceiro: string;

  @ApiProperty({ required: false })
  @IsOptional()
  nomeTerceiro: string;

  @ApiProperty({ required: false })
  @IsOptional()
  telefoneTerceiro: string;
}
