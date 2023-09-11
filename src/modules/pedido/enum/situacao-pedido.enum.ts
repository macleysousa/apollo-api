export enum SituacaoPedido {
  em_andamento = 'em_andamento',
  conferido = 'conferido',
  faturado = 'faturado',
  encerrado = 'encerrado',
  cancelado = 'cancelado',
}

export type SituacaoPedidoType = keyof typeof SituacaoPedido;
