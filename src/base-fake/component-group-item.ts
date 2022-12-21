import { ComponentGroupItemEntity } from 'src/modules/component-group/item/entities/component-group-item.entity';

class ComponentGroupItemFakeRepository {
    find(): ComponentGroupItemEntity[] {
        const group = new ComponentGroupItemEntity();
        group.id = 1;
        group.groupId = 1;
        group.componentId = 'ADMFM001';
        group.createdAt = new Date('2022-10-15T11:13:18.000Z');
        group.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return [group];
    }

    findOne(): ComponentGroupItemEntity {
        const group = new ComponentGroupItemEntity();
        group.id = 1;
        group.groupId = 1;
        group.componentId = 'ADMFM001';
        group.createdAt = new Date('2022-10-15T11:13:18.000Z');
        group.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return group;
    }
}

const componentGroupItemFakeRepository = new ComponentGroupItemFakeRepository();
export { componentGroupItemFakeRepository };
