export enum EmpresaIncludeEnum {
  terminais = 'terminais',
  formasDePagamento = 'formasDePagamento',
  parametros = 'parametros',
}

export type EmpresaInclude = keyof typeof EmpresaIncludeEnum;
