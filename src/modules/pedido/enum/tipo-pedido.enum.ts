export enum TipoPedido {
  venda = 'venda',
  compra = 'compra',
  transferencia = 'transferencia',
}

export type TipoPedidoType = keyof typeof TipoPedido;
