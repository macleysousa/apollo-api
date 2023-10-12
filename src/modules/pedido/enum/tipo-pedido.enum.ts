export enum TipoPedido {
  venda = 'venda',
  compra = 'compra',
  transferencia_saida = 'transferencia_saida',
  transferencia_entrada = 'transferencia_entrada',
}

export type TipoPedidoType = keyof typeof TipoPedido;
