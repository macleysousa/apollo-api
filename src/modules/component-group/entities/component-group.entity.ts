import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ComponentGroupItemEntity } from './component-group-item.entity';

@Entity({ name: 'componentGroups' })
export class ComponentGroupEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ type: () => ComponentGroupItemEntity })
    @OneToMany(() => ComponentGroupItemEntity, (value) => value.groupId)
    items: ComponentGroupItemEntity[];
}
