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
  situacao: ParcelaSituacao | keyof typeof ParcelaSituacao;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  banco: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  agencia: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  conta: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  documento: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  nsu: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  autorizacao: string;

  @ApiProperty()
  @Column('int')
  cheque: number;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  banda: string;

  @ApiProperty()
  @Column('boolean')
  chequerTerceiro: boolean;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  cpfCnpjTerceiro: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  nomeTerceiro: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  telefoneTerceiro: string;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  observacao: string;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  motivoCancelamento: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @Exclude()
  @ManyToOne(() => FaturaEntity, (fatura) => fatura.id)
  @JoinColumn({ name: 'faturaId', referencedColumnName: 'id' })
  fatura: FaturaEntity;

  constructor(partial?: Partial<FaturaParcelaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
