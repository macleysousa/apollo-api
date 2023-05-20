import { TamanhoEntity } from 'src/modules/tamanho/entities/tamanho.entity';

class SizeFakeRepository {
  find(): TamanhoEntity[] {
    const size = new TamanhoEntity({
      id: 1,
      nome: 'P',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativo: true,
    });

    return [size];
  }

  findOne(): TamanhoEntity {
    const size = new TamanhoEntity({
      id: 1,
      nome: 'P',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativo: true,
    });

    return size;
  }
}

const sizeFakeRepository = new SizeFakeRepository();
export { sizeFakeRepository };
