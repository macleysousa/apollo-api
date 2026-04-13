export enum CaixaSituacao {
  aberto = 'aberto',
  contagem = 'contagem',
  fechado = 'fechado',
}

export type CaixaSituacaoType = keyof typeof CaixaSituacao;
