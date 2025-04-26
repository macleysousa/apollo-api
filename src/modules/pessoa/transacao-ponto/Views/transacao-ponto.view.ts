import { ApiProperty } from '@nestjs/swagger';
import { Column, ViewEntity } from 'typeorm';

import { TransacaoPontoEntity } from '../entities/transacao-ponto.entity';

@ViewEntity('view_pessoas_transacoes_pontos')
export class TransacaoPontoView extends TransacaoPontoEntity {
  @ApiProperty()
  @Column('decimal')
  saldo: number;

  @ApiProperty()
  @Column('boolean', { transformer: { from: (value) => (value == '0' ? false : true), to: (value) => value } })
  valida: boolean;
}
