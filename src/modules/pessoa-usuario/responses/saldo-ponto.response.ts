import { ApiProperty } from '@nestjs/swagger';

import { TransacaoPontoView } from 'src/modules/pessoa/transacao-ponto/Views/transacao-ponto.view';

export class SaldoPontoResponse {
  @ApiProperty({ description: 'Saldo total de pontos do usuário' })
  saldoPontos: number;

  @ApiProperty({ type: [TransacaoPontoView], description: 'Histórico recente de transações de pontos' })
  historico: TransacaoPontoView[];
}
