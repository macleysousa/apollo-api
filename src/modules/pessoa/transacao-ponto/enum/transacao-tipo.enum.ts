export enum TransacaoTipoEnum {
  Ganho = 'Ganho',
  Resgate = 'Resgate',
}

export type TransacaoTipo = keyof typeof TransacaoTipoEnum;
