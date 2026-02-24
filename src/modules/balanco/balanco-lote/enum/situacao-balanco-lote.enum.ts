export enum SituacaoBalancoLote {
  ativo = 'ativo',
  cancelado = 'cancelado',
}

export type SituacaoBalancoLoteType = keyof typeof SituacaoBalancoLote;
