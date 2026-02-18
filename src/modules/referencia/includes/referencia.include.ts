export enum ReferenciaIncludeEnum {
  tudo = 'tudo',
  categoria = 'categoria',
  subCategoria = 'subCategoria',
}

export type ReferenciaInclude = keyof typeof ReferenciaIncludeEnum;
