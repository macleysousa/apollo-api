import { MarcaEntity } from 'src/modules/marca/entities/marca.entity';

class MeasurementUnitFakeRepository {
  find(): MarcaEntity[] {
    const item = new MarcaEntity({
      id: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });

    return [item];
  }

  findOne(): MarcaEntity {
    const item = new MarcaEntity({
      id: 1,
      nome: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      inativa: true,
    });
    return item;
  }
}

const unitMeasureFakeRepository = new MeasurementUnitFakeRepository();
export { unitMeasureFakeRepository };
