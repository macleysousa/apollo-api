import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';
import { decrypt, encrypt } from 'src/commons/crypto';

import { Role } from '../enum/user-role.enum';
import { UserStatus } from '../enum/user-status';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    username: string;

    @Exclude()
    @Column({
        transformer: {
            to: value => {
                return encrypt(value);
            },
            from: value => {
                return decrypt(value);
            },
        },
    })
    password: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ enum: Role })
    @Column()
    role: Role;

    @ApiProperty()
    @Column()
    status: UserStatus;
}
