import { ComponenteGrupoItemEntity } from 'src/modules/componente-grupo/item/entities/componente-grupo-item.entity';

class ComponentGroupItemFakeRepository {
  find(): ComponenteGrupoItemEntity[] {
    const group = new ComponenteGrupoItemEntity();
    group.id = 1;
    group.grupoId = 1;
    group.componenteId = 'ADMFM001';
    group.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    group.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return [group];
  }

  findOne(): ComponenteGrupoItemEntity {
    const group = new ComponenteGrupoItemEntity();
    group.id = 1;
    group.grupoId = 1;
    group.componenteId = 'ADMFM001';
    group.criadoEm = new Date('2022-10-15T11:13:18.000Z');
    group.atualizadoEm = new Date('2022-10-15T11:13:18.000Z');
    return group;
  }
}

const componentGroupItemFakeRepository = new ComponentGroupItemFakeRepository();
export { componentGroupItemFakeRepository };
