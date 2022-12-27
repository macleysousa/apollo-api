import { ApiProperty } from '@nestjs/swagger';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { ComponentGroupItemEntity } from 'src/modules/component-group/item/entities/component-group-item.entity';
import { Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users_groups_accesses' })
export class GroupAccess {
    @ApiProperty()
    @PrimaryColumn()
    userId: number;

    @ApiProperty()
    @PrimaryColumn()
    branchId: number;

    @ApiProperty({ type: () => BranchEntity })
    @OneToOne(() => BranchEntity, (value) => value.id)
    branch: BranchEntity;

    @ApiProperty()
    @PrimaryColumn()
    groupId: number;

    @ApiProperty({ type: () => ComponentGroupItemEntity })
    @OneToOne(() => ComponentGroupItemEntity, (value) => value.id)
    group: ComponentGroupItemEntity;
}
