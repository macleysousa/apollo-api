import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/commons/base.entity';
import { ComponentEntity } from 'src/modules/component/entities/component.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ComponentGroupEntity } from '../../entities/component-group.entity';

@Entity({ name: 'components_groups_items' })
export class ComponentGroupItemEntity extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    groupId: number;

    @Exclude()
    @Column()
    componentId: string;

    @ApiProperty({ type: () => ComponentEntity })
    @OneToOne(() => ComponentEntity, (value) => value.id)
    @JoinColumn({ name: 'componentId', referencedColumnName: 'id' })
    component: ComponentEntity;

    @Exclude()
    @ManyToOne(() => ComponentGroupEntity, (value) => value.id)
    @JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
    group: ComponentGroupEntity;

    constructor(partial?: Partial<ComponentGroupItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}
