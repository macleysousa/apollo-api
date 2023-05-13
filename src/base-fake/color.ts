import { ColorEntity } from 'src/modules/color/entities/color.entity';

class ColorFakeRepository {
  find(): ColorEntity[] {
    const color = new ColorEntity({
      id: 1,
      name: 'black',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return [color];
  }

  findOne() {
    const color = new ColorEntity({
      id: 1,
      name: 'black',
      criadoEm: new Date('2022-10-15T11:13:18.000Z'),
      atualizadoEm: new Date('2022-10-15T11:13:18.000Z'),
    });

    return color;
  }
}

const colorFakeRepository = new ColorFakeRepository();
export { colorFakeRepository };
