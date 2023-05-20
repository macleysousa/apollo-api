import { ComponenteGrupoEntity } from 'src/modules/componente-grupo/entities/componente-grupo.entity';

class ComponentGroupFakeRepository {
  find(): ComponenteGrupoEntity[] {
    const group = new ComponenteGrupoEntity();
    group.id = 1;
    group.nome = 'Admin';
    group.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    group.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return [group];
  }

  findOne(): ComponenteGrupoEntity {
    const group = new ComponenteGrupoEntity();
    group.id = 1;
    group.nome = 'Admin';
    group.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    group.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return group;
  }
}

const componentGroupFakeRepository = new ComponentGroupFakeRepository();
export { componentGroupFakeRepository };
