import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'estoque' })
export class EstoqueEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  quantidade: number;

  @UpdateDateColumn({ default: 'now()' })
  @ApiProperty()
  atualizadoEm?: Date;

  constructor(partial?: Partial<EstoqueEntity>) {
    Object.assign(this, partial);
  }
}
