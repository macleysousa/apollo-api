import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';

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

  constructor(partial?: Partial<EmpresaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
