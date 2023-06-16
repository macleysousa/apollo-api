import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { FaturaEntity } from '../../entities/fatura.entity';
import { ParcelaSituacao } from '../enum/parcela-situacao.enum';

@Entity({ name: 'faturas_parcelas' })
export class FaturaParcelaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  faturaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  parcela: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valor: number;

  @ApiProperty()
  @Column('date')
  vencimento: Date;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valorDesconto: number;

  @ApiProperty()
  @Column('int')
  caixaPagamento: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valorPago: number;

  @ApiProperty()
  @Column('date')
  pagamento: Date;

  @ApiProperty()
  @Column('enum', { enum: ParcelaSituacao })
  situacao: ParcelaSituacao;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  observacao: string;

  @Exclude()
  @ManyToOne(() => FaturaEntity, (fatura) => fatura.id)
  @JoinColumn({ name: 'faturaId', referencedColumnName: 'id' })
  fatura: FaturaEntity;

  constructor(partial?: Partial<FaturaParcelaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
