import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';

import { CaixaContagemEntity } from './contagem.entity';

@Entity({ name: 'caixas_contagem_item' })
export class CaixaContagemItemEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('bigint')
  caixaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  contagemId: number;

  @ApiProperty({ enum: TipoDocumento })
  @Column('varchar', { length: 45 })
  tipoDocumento: TipoDocumento;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valor: number;

  @ManyToOne(() => CaixaContagemEntity, (contagem) => contagem.items)
  @JoinColumn({ name: 'contagemId', referencedColumnName: 'id' })
  contagem?: Relation<CaixaContagemEntity>;

  constructor(partial?: Partial<CaixaContagemItemEntity>) {
    Object.assign(this, partial);
  }
}
