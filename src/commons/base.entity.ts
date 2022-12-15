import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @CreateDateColumn({ default: new Date() })
    @ApiProperty()
    createdAt: Date;

    @UpdateDateColumn({ default: new Date() })
    @ApiProperty()
    updatedAt: Date;
}
