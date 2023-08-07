import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';

@Entity({ name: 'romaneios' })
export class RomaneioEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty()
  @Column('int')
  empresaId: number;

  @ApiProperty()
  @Column('date')
  data: Date;

  @ApiProperty()
  @Column('int')
  pessoaId: number;

  @ApiProperty()
  @Column('int')
  funcionarioId: number;

  @ApiProperty()
  @Column('int')
  tabelaPrecoId: number;

  @ApiProperty()
  @Column('boolean')
  pago: boolean;

  @ApiProperty()
  @Column('boolean')
  acertoConsignacao: boolean;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @Column('text')
  observacao: string;

  @ApiProperty({ enum: ModalidadeRomaneio })
  @Column('varchar')
  modalidade: ModalidadeRomaneio;

  @ApiProperty({ enum: OperacaoRomaneio })
  @Column('varchar')
  operacao: OperacaoRomaneio;

  @ApiProperty({ enum: SituacaoRomaneio })
  @Column('varchar')
  situacao: SituacaoRomaneio;

  constructor(partial?: Partial<RomaneioEntity>) {
    super();
    Object.assign(this, partial);
  }
}
