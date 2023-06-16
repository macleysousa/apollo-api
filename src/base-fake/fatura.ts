import { TipoInclusao } from 'src/commons/enum/tipo-inclusao';
import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';
import { FaturaSituacao } from 'src/modules/fatura/enum/fatura-situacao.enum';
import { RomaneioView } from 'src/modules/romaneio/views/romaneio.view';

export class FaturaFakeRepository {
  findOne(): FaturaEntity {
    const item = new FaturaEntity({
      empresaId: 1,
      data: new Date('2023-06-05'),
      pessoaId: 1,
      valor: 79.9,
      situacao: FaturaSituacao.Normal,
      tipoInclusao: TipoInclusao.Manual,
      operadorId: 1,
      criadoEm: new Date('2023-06-05T11:13:18.000Z'),
      atualizadoEm: new Date('2023-06-05T11:13:18.000Z'),
    });
    return item;
  }

  find(): FaturaEntity[] {
    const item = this.findOne();

    return [item];
  }

  findPaginate(): PaginatedDTO<FaturaEntity>[] {
    const item: PaginatedDTO<FaturaEntity> = {
      items: this.find(),
      meta: {
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 100,
        totalPages: 10,
      },
    };
    return [item];
  }
}

const faturaFakeRepository = new FaturaFakeRepository();
export { faturaFakeRepository };
