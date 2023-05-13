import { BrandEntity } from 'src/modules/brand/entities/brand.entity';

class MeasurementUnitFakeRepository {
  find(): BrandEntity[] {
    const item = new BrandEntity({
      id: 1,
      name: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });

    return [item];
  }

  findOne(): BrandEntity {
    const item = new BrandEntity({
      id: 1,
      name: 'Name',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
      active: true,
    });
    return item;
  }
}

const unitMeasureFakeRepository = new MeasurementUnitFakeRepository();
export { unitMeasureFakeRepository };
