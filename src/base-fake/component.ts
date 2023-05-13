import { ComponenteEntity } from 'src/modules/componente/entities/componente.entity';

class ComponentFakeRepository {
  find(): ComponenteEntity[] {
    const component = new ComponenteEntity();
    component.id = 'ADMFM001';
    component.nome = 'NAME COMPONENT';
    component.descontinuado = false;
    component.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    component.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return [component];
  }

  findOne(): ComponenteEntity {
    const component = new ComponenteEntity();
    component.id = 'ADMFM001';
    component.nome = 'NAME COMPONENT';
    component.descontinuado = false;
    component.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    component.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return component;
  }
}

const componentFakeRepository = new ComponentFakeRepository();
export { componentFakeRepository };
