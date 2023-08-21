export enum RomaneioIncludeEnum {
  itens = 'itens',
  frete = 'frete',
  liquidacao = 'liquidacao',
}

export type RomaneioInclude = keyof typeof RomaneioIncludeEnum;
