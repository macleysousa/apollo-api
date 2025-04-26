import { PaginatedDTO } from 'src/decorators/api-paginated-response.decorator';
import { PessoaEntity } from 'src/modules/pessoa/entities/pessoa.entity';
import { PessoaTipo } from 'src/modules/pessoa/enum/pessoa-tipo.enum';

class PessoaFakeRepository {
  find(): PessoaEntity[] {
    const value = new PessoaEntity({
      id: 1,
      nome: 'John Doe',
      documento: '123456789',
      tipo: PessoaTipo.Física,
      empresaCadastro: 1,
      empresasAcesso: [1],
    });

    return [value];
  }

  findPaginate(): PaginatedDTO<PessoaEntity>[] {
    const item: PaginatedDTO<PessoaEntity> = {
      items: pessoaFakeRepository.find(),
      meta: {
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 1,
        totalItems: 1,
        totalPages: 1,
      },
    };
    return [item];
  }

  findOne(): PessoaEntity {
    const value = pessoaFakeRepository.find()[0];
    return value;
  }
}

const pessoaFakeRepository = new PessoaFakeRepository();
export { pessoaFakeRepository };
