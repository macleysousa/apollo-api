export enum OperacaoRomaneio {
  compra = 'compra',
  compra_devolucao = 'compra_devolucao',
  venda = 'venda',
  venda_devolucao = 'venda_devolucao',
  consignacao_saida = 'consignacao_saida',
  consignacao_devolucao = 'consignacao_devolucao',
  consignacao_acerto = 'consignacao_acerto',
  transferencia_saida = 'transferencia_saida',
  transferencia_entrada = 'transferencia_entrada',
  transferencia_devolucao = 'transferencia_devolucao',
  outros = 'outros',
}

export type OperacaoRomaneioType = keyof typeof OperacaoRomaneio;
