export enum ReferenciaIncludeEnum {
  terminais = 'terminais',
  formasDePagamento = 'formasDePagamento',
  parametros = 'parametros',
}

export type ReferenciaInclude = keyof typeof ReferenciaIncludeEnum;
