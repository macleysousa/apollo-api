import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';

import { TransacaoTipo, TransacaoTipoEnum } from '../enum/transacao-tipo.enum';

export class CreateTransacaoPontoDto {
  @ApiProperty({ enum: TransacaoTipoEnum })
  @IsNotEmpty({ message: 'Tipo de transação é obrigatório' })
  @IsEnum(TransacaoTipoEnum, { message: 'Tipo de transação inválido' })
  tipo: TransacaoTipo;

  @ApiProperty()
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsBetween(0, 1000000, { message: 'Quantidade deve ser um número positivo' })
  quantidade: number;

  @ApiProperty({ required: false })
  @IsOptional()
  observacao?: string;
}
