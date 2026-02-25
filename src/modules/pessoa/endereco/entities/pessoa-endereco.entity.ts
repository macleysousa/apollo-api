import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { UF } from 'src/commons/enum/uf.enum';

import { PessoaEntity } from '../../entities/pessoa.entity';
import { EnderecoTipo } from '../enum/endereco-tipo.enum';

@Entity({ name: 'pessoas_enderecos' })
export class PessoaEnderecoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  pessoaId: number;

  @ApiProperty()
  @Column()
  principal: boolean;

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

  @Exclude()
  @ManyToOne(() => PessoaEntity, (pessoa) => pessoa.enderecos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pessoaId' })
  pessoa: Relation<PessoaEntity>;

  constructor(partial?: Partial<PessoaEnderecoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
