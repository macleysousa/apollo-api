import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsFormaPagamento } from 'src/commons/validations/is-forma-pagamento.validation';

export class PagamentoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo controle é obrigatório.' })
  @IsInt({ message: 'O controle deve ser um número inteiro.' })
  @IsBetween(1, 999, { message: 'O controle deve ser um número entre 1 e 999.' })
  controle: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo formaDePagamentoId é obrigatório.' })
  @IsFormaPagamento()
  formaDePagamentoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo parcela é obrigatório.' })
  @IsInt({ message: 'O número de parcelas deve ser um número inteiro.' })
  @IsBetween(1, 360, { message: 'O número de parcelas deve ser entre 1 e 360.' })
  parcela: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo valor é obrigatório.' })
  @IsBetween(0.01, 1000000, { message: 'O valor deve ser entre 0,01 e 1000000' })
  valor: number;

  @ApiProperty({ type: Date, format: 'date', required: false })
  @IsOptional()
  vencimento?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  banco?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  agencia?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  conta?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  documento?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  nsu?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  autorizacao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  cheque?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  banda?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  chequerTerceiro?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  cpfCnpjTerceiro?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  nomeTerceiro?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  telefoneTerceiro?: string;
}
