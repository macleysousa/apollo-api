export enum SituacaoPedido {
  em_andamento = 'em_andamento',
  encerrado = 'encerrado',
  cancelado = 'cancelado',
}

export type SituacaoPedidoType = keyof typeof SituacaoPedido;
