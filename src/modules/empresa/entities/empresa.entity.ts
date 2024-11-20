import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transform } from 'class-transformer';
import { BaseEntity } from 'src/commons/base.entity';
import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';
import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { EmpresaFormaPagamentoEntity } from '../forma-de-pagamento/entities/forma-de-pagamento.entity';
import { EmpresaParametroView } from '../parametro/views/parametro.view';
import { TerminalEntity } from '../terminal/entities/terminal.entity';

@Entity({ name: 'empresas' })
export class EmpresaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  cnpj: string;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  nomeFantasia: string;

  @ApiProperty()
  @Column()
  ativa: boolean;

  @ApiProperty({ enum: UF, default: UF.NaoInformado })
  @Column()
  uf: UF;

  @ApiProperty()
  @Column()
  inscricaoEstadual: string;

  @ApiProperty()
  @Column()
  codigoDeAtividade: string;

  @ApiProperty()
  @Column()
  codigoDeNaturezaJuridica: string;

  @ApiProperty({ enum: TaxRegime, default: TaxRegime.NaoInformado })
  @Column()
  regime: TaxRegime;

  @ApiProperty({ enum: SubTributary, default: SubTributary.NaoInformado })
  @Column()
  substituicaoTributaria: SubTributary;

  @ApiProperty()
  @Column()
  suframa: string;

  @ApiProperty()
  @Column()
  registroMunicipal: string;

  @ApiProperty()
  @Column()
  telefone: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ type: 'date' })
  data: Date;

  @ApiProperty({ type: () => TerminalEntity })
  @OneToMany(() => TerminalEntity, ({ empresa }) => empresa)
  terminais: TerminalEntity[];

  @ApiProperty({ type: () => FormaDePagamentoEntity })
  @OneToMany(() => EmpresaFormaPagamentoEntity, ({ empresa }) => empresa)
  @Transform(({ value }) => value.map(({ formaDePagamento }) => formaDePagamento))
  formasDePagamento: FormaDePagamentoEntity[];

  @ApiProperty({ type: () => EmpresaParametroView })
  @OneToMany(() => EmpresaParametroView, (value) => value.empresa)
  parametros: EmpresaParametroView[];

  constructor(partial?: Partial<EmpresaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
