export enum OperacaoRomaneio {
  compra = 'compra',
  devolucao_compra = 'devolucao_compra',
  venda = 'venda',
  venda_devolucao = 'venda_devolucao',
  consignacao_saida = 'consignacao_saida',
  consignacao_devolucao = 'consignacao_devolucao',
  consignacao_acerto = 'consignacao_acerto',
  brinde = 'brinde',
  transferencia_saida = 'transferencia_saida',
  transferencia_entrada = 'transferencia_entrada',
  transferencia_devolucao = 'transferencia_devolucao',
  outros = 'outros',
}

export type OperacaoRomaneioType = keyof typeof OperacaoRomaneio;
