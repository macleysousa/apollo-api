export enum PedidoIncludeEnum {
  itens = 'itens',
}

export type PedidoInclude = keyof typeof PedidoIncludeEnum;
