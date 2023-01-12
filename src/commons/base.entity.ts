import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ default: 'now()' })
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn({ default: 'now()' })
  @ApiProperty()
  updatedAt?: Date;
}
