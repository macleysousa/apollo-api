export enum ParametroEnum {
  CD_PRECO_PADRAO,
  QT_DIAS_TROCA,
  QT_DIAS_DEVOLUCAO,
  OBS_PADRAO_COMPRA,
  OBS_PADRAO_VENDA,
  DEVOLVER_SEM_ROMANEIO,
}

export type Parametro = keyof typeof ParametroEnum;