import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsFormaPagamento } from 'src/commons/validations/is-forma-pagamento.validation';

export class AddEmpresaFormaPagamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsFormaPagamento()
  formaPagamentoId: number;
}
