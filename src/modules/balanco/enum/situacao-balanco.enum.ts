export enum SituacaoBalanco {
  em_andamento = 'em_andamento',
  encerrado = 'encerrado',
  cancelado = 'cancelado',
}

export type SituacaoBalancoType = keyof typeof SituacaoBalanco;
