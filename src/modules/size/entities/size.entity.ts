import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sizes' })
export class SizeEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    active: boolean;

    constructor(partial?: Partial<SizeEntity>) {
        super();
        Object.assign(this, partial);
    }
}
