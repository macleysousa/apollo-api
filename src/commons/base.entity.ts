import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ default: 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  criadoEm?: Date;

  @UpdateDateColumn({ default: 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  atualizadoEm?: Date;
}
