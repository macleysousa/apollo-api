import { ReferenciaEntity } from 'src/modules/referencia/entities/referencia.entity';

class ReferenceFakeRepository {
  find(): ReferenciaEntity[] {
    const item = new ReferenciaEntity({
      id: 1,
      nome: 'reference',
      idExterno: '0001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [item];
  }

  findOne(): ReferenciaEntity {
    const item = new ReferenciaEntity({
      id: 1,
      nome: 'reference',
      idExterno: '0001',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return item;
  }
}

const referenceFakeRepository = new ReferenceFakeRepository();
export { referenceFakeRepository };
