import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ default: 'now()' })
  @ApiProperty()
  criadoEm?: Date;

  @UpdateDateColumn({ default: 'now()' })
  @ApiProperty()
  atualizadoEm?: Date;
}
