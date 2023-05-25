import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { SubTributary } from 'src/commons/enum/sub-tributary';
import { TaxRegime } from 'src/commons/enum/tax-regime';
import { UF } from 'src/commons/enum/uf.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @ApiProperty({ enum: UF, default: UF.NotInformed })
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

  @ApiProperty({ enum: SubTributary, default: SubTributary.NotInformed })
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

  constructor(partial?: Partial<EmpresaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
