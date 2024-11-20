import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoInclusao } from 'src/commons/enum/tipo-inclusao';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { PessoaEntity } from 'src/modules/pessoa/entities/pessoa.entity';

import { FaturaSituacao } from '../enum/fatura-situacao.enum';
import { FaturaParcelaEntity } from '../parcela/entities/parcela.entity';

@Entity({ name: 'faturas' })
export class FaturaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @Column('int')
  pessoaId: number;

  @ApiProperty()
  @OneToOne(() => PessoaEntity, { eager: true })
  @JoinColumn({ name: 'pessoaId' })
  pessoa: PessoaEntity;

  @ApiProperty()
  @Column('bigint')
  romaneioId: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valor: number;

  @ApiProperty()
  @Column('int')
  parcelas: number;

  @ApiProperty({ enum: TipoDocumento })
  @Column('enum', { enum: TipoDocumento })
  tipoDocumento: TipoDocumento;

  @ApiProperty({ enum: TipoMovimento })
  @Column('enum', { enum: TipoMovimento })
  tipoMovimento: TipoMovimento;

  @ApiProperty({ enum: TipoInclusao })
  @Column('enum', { enum: TipoInclusao })
  tipoInclusao: TipoInclusao;

  @ApiProperty({ enum: FaturaSituacao })
  @Column('varchar', { length: 255 })
  situacao: FaturaSituacao;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  observacao: string;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  motivoCancelamento: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @OneToMany(() => FaturaParcelaEntity, (faturaParcela) => faturaParcela.fatura)
  itens: FaturaParcelaEntity[];

  constructor(partial?: Partial<FaturaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
