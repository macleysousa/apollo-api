export enum SituacaoRomaneio {
  em_andamento = 'em_andamento',
  encerrado = 'encerrado',
  cancelado = 'cancelado',
}

export type SituacaoRomaneioType = keyof typeof SituacaoRomaneio;
