import { ComponentEntity } from 'src/modules/components/entities/component.entity';

class ComponentFakeRepository {
    find(): ComponentEntity[] {
        const component = new ComponentEntity();
        component.id = 'ADMFM001';
        component.name = 'NAME COMPONENT';
        component.blocked = false;
        component.createdAt = new Date('2022-10-15T11:13:18.000Z');
        component.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return [component];
    }

    findOne(): ComponentEntity {
        const component = new ComponentEntity();
        component.id = 'ADMFM001';
        component.name = 'NAME COMPONENT';
        component.blocked = false;
        component.createdAt = new Date('2022-10-15T11:13:18.000Z');
        component.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return component;
    }
}

const componentFakeRepository = new ComponentFakeRepository();
export { componentFakeRepository };
