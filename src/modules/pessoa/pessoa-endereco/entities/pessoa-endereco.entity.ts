import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { UF } from 'src/commons/enum/uf.enum';

import { EnderecoTipo } from '../enum/endereco-tipo.enum';

@Entity({ name: 'pessoas_enderecos' })
export class PessoaEnderecoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  pessoaId: number;

  @ApiProperty({ enum: EnderecoTipo })
  @Column()
  tipoEndereco: EnderecoTipo;

  @ApiProperty()
  @Column({ nullable: true })
  cep: string;

  @ApiProperty()
  @Column({ nullable: true })
  logradouro: string;

  @ApiProperty()
  @Column({ nullable: true })
  numero: string;

  @ApiProperty()
  @Column({ nullable: true })
  complemento: string;

  @ApiProperty()
  @Column({ nullable: true })
  bairro: string;

  @ApiProperty()
  @Column({ nullable: true })
  municipio: string;

  @ApiProperty({ enum: UF })
  @Column({ nullable: true })
  uf: UF;

  @ApiProperty()
  @Column({ nullable: true })
  pais: string;

  constructor(partial?: Partial<PessoaEnderecoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
