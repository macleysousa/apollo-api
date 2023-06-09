import { RomaneioItemView } from 'src/modules/romaneio/romaneio-item/views/romaneio-item.view';

export class RomaneioFakeRepository {
  findViewItens(): RomaneioItemView[] {
    const item = new RomaneioItemView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-09'),
      referenciaId: 1,
      referenciaIdExterno: '1',
      referenciaNome: 'Referencia 1',
      produtoId: 1,
      produtoIdExterno: '1',
      corId: 1,
      corNome: 'Cor 1',
      tamanhoId: 1,
      tamanhoNome: 'Tamanho 1',
      modalidade: 'Venda',
      operacao: 'Entrada',
      situacao: 'Aberto',
      emPromocao: false,
      quantidade: 2,
      valorUnitario: 79.9,
      valorUnitDesconto: 0.1,
      valorTotalBruto: 159.8,
      valorTotalDesconto: 0.2,
      valorTotalLiquido: 159.6,
      cupomId: 1,
      operadorId: 1,
      criadoEm: new Date('2023-06-09'),
      atualizadoEm: new Date('2023-06-09'),
    });

    return [item];
  }

  findOneViewItem(): RomaneioItemView {
    const item = new RomaneioItemView({
      empresaId: 1,
      romaneioId: 1,
      data: new Date('2023-06-09'),
      referenciaId: 1,
      referenciaIdExterno: '1',
      referenciaNome: 'Referencia 1',
      produtoId: 1,
      produtoIdExterno: '1',
      corId: 1,
      corNome: 'Cor 1',
      tamanhoId: 1,
      tamanhoNome: 'Tamanho 1',
      modalidade: 'Venda',
      operacao: 'Entrada',
      situacao: 'Aberto',
      emPromocao: false,
      quantidade: 2,
      valorUnitario: 79.9,
      valorUnitDesconto: 0.1,
      valorTotalBruto: 159.8,
      valorTotalDesconto: 0.2,
      valorTotalLiquido: 159.6,
      cupomId: 1,
      operadorId: 1,
      criadoEm: new Date('2023-06-09'),
      atualizadoEm: new Date('2023-06-09'),
    });

    return item;
  }
}
