import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { ComponentGroupEntity } from 'src/modules/component-group/entities/component-group.entity';
import { ComponentGroupItemEntity } from 'src/modules/component-group/item/entities/component-group-item.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users_groups_accesses' })
export class UserGroupAccessEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryColumn()
    userId: number;

    @ApiProperty()
    @PrimaryColumn()
    branchId: number;

    @ApiProperty()
    @PrimaryColumn()
    groupId: number;

    @ApiProperty({ type: () => ComponentGroupEntity })
    @OneToOne(() => ComponentGroupEntity, (value) => value.id)
    @JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
    group: ComponentGroupEntity;

    @ApiProperty()
    @Column()
    operatorId: number;

    constructor(partial: Partial<UserGroupAccessEntity>) {
        super();
        Object.assign(this, partial);
    }
}
