export enum ParametroEnum {
  CD_PRECO_PADRAO = 'CD_PRECO_PADRAO',
  QT_DIAS_TROCA = 'QT_DIAS_TROCA',
  QT_DIAS_DEVOLUCAO = 'QT_DIAS_DEVOLUCAO',
  OBS_PADRAO_COMPRA = 'OBS_PADRAO_COMPRA',
  OBS_PADRAO_VENDA = 'OBS_PADRAO_VENDA',
  OBS_PADRAO_CONSIGNACAO = 'OBS_PADRAO_CONSIGNACAO',
  DEVOLVER_SEM_ROMANEIO = 'DEVOLVER_SEM_ROMANEIO',
  FATURAR_PEDIDO_SEM_CONFERENCIA = 'FATURAR_PEDIDO_SEM_CONFERENCIA',
}

export type Parametro = keyof typeof ParametroEnum;
