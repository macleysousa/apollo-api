export enum PessoaIncludeEnum {
  tudo = 'tudo',
  enderecos = 'enderecos',
}

export type PessoaInclude = keyof typeof PessoaIncludeEnum;
