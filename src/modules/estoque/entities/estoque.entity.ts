import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'estoque' })
export class EstoqueEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  referenciaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  saldo: number;

  @ApiProperty()
  @UpdateDateColumn({ default: 'now()' })
  atualizadoEm?: Date;

  constructor(partial?: Partial<EstoqueEntity>) {
    Object.assign(this, partial);
  }
}
