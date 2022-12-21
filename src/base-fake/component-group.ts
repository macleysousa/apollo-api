import { ComponentGroupEntity } from 'src/modules/component-group/entities/component-group.entity';
import { ComponentEntity } from 'src/modules/component/entities/component.entity';

class ComponentGroupFakeRepository {
    find(): ComponentGroupEntity[] {
        const group = new ComponentGroupEntity();
        group.id = 1;
        group.name = 'Admin';
        group.createdAt = new Date('2022-10-15T11:13:18.000Z');
        group.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return [group];
    }

    findOne(): ComponentGroupEntity {
        const group = new ComponentGroupEntity();
        group.id = 1;
        group.name = 'Admin';
        group.createdAt = new Date('2022-10-15T11:13:18.000Z');
        group.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return group;
    }
}

const componentGroupFakeRepository = new ComponentGroupFakeRepository();
export { componentGroupFakeRepository };
