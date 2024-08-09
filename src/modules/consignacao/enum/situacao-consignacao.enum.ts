export enum SituacaoConsignacaoEnum {
  em_andamento = 'em_andamento',
  encerrada = 'encerrada',
  cancelada = 'cancelada',
}

export type SituacaoConsignacao = keyof typeof SituacaoConsignacaoEnum;
