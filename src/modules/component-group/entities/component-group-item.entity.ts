import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/commons/base.entity';
import { ComponentEntity } from 'src/modules/component/entities/component.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ComponentGroupEntity } from './component-group.entity';

@Entity({ name: 'componentGroupItems' })
export class ComponentGroupItemEntity extends BaseEntity {
    @ApiProperty()
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
    component: ComponentEntity;

    @Exclude()
    @ManyToOne(() => ComponentGroupEntity, (value) => value.id)
    group: ComponentGroupEntity;
}
