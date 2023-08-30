export enum SituacaoConsignacaoEnum {
  aberta = 'aberta',
  fechada = 'fechada',
  cancelada = 'cancelada',
}

export type SituacaoConsignacao = keyof typeof SituacaoConsignacaoEnum;
