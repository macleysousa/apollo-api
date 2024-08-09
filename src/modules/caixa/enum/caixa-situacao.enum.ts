export enum CaixaSituacao {
  aberto = 'aberto',
  fechado = 'fechado',
}

export type CaixaSituacaoType = keyof typeof CaixaSituacao;
