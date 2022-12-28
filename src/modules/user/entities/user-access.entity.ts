import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'user_accesses' })
export class UserAccessEntity {
    @ApiProperty()
    @ViewColumn()
    id: number;

    @ApiProperty()
    @ViewColumn()
    branchId: number;

    @ApiProperty()
    @ViewColumn()
    groupId: number;

    @ApiProperty()
    @ViewColumn()
    groupName: string;

    @ApiProperty()
    @ViewColumn()
    componentId: string;

    @ApiProperty()
    @ViewColumn()
    componentName: string;

    @ApiProperty()
    @ViewColumn()
    blocked: boolean;

    constructor(partial?: Partial<UserAccessEntity>) {
        Object.assign(this, partial);
    }
}
