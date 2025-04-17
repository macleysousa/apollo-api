export enum TransacaoTipoEnum {
  Débito = 'Débito',
  Crédito = 'Crédito',
}

export type TransacaoTipo = keyof typeof TransacaoTipoEnum;
