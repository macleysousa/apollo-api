import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';

@Entity({ name: 'romaneios' })
export class RomaneioEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  empresaId: number;

  @ApiProperty()
  @Column()
  data: Date;

  @ApiProperty()
  @Column()
  pessoaId: number;

  @ApiProperty()
  @Column()
  funcionarioId: number;

  @ApiProperty()
  @Column()
  tabelaPrecoId: number;

  @ApiProperty()
  @Column()
  pago: boolean;

  @ApiProperty()
  @Column()
  acertoConsignacao: boolean;

  @ApiProperty()
  @Column()
  operadorId: number;

  @ApiProperty()
  @Column()
  observacao: string;

  @ApiProperty({ enum: ModalidadeRomaneio })
  @Column()
  modalidade: ModalidadeRomaneio;

  @ApiProperty({ enum: OperacaoRomaneio })
  @Column()
  operacao: OperacaoRomaneio;

  @ApiProperty({ enum: SituacaoRomaneio })
  @Column()
  situacao: SituacaoRomaneio;

  constructor(partial?: Partial<RomaneioEntity>) {
    super();
    Object.assign(this, partial);
  }
}
