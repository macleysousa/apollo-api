export enum OperacaoRomaneio {
  Compra = 'Compra',
  Devolucao_Compra = 'Devolução Compra',
  Venda = 'Venda',
  Devolucao_Venda = 'Devolução Venda',
  Saida_Consignacao = 'Saída Consignação',
  Devolucao_Consignacao = 'Devolução Consignação',
  Acerto_Consignacao = 'Acerto Consignação',
  Brinde = 'Brinde',
  Transferencia = 'Transferência',
  Devolucao_Transferencia = 'Devolução Transferência',
  Outros = 'Outros',
}

export type OperacaoRomaneioType = keyof typeof OperacaoRomaneio;
