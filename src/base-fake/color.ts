import { CorEntity } from 'src/modules/cor/entities/cor.entity';

class ColorFakeRepository {
  find(): CorEntity[] {
    const color = new CorEntity({
      id: 1,
      nome: 'black',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [color];
  }

  findOne() {
    const color = new CorEntity({
      id: 1,
      nome: 'black',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return color;
  }
}

const colorFakeRepository = new ColorFakeRepository();
export { colorFakeRepository };
