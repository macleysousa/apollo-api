import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { VendedorTipo } from '../enum/vendedor-tipo.enum';

@Entity({ name: 'vendedores' })
export class VendedorEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ nullable: false })
  empresaId: number;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  nome: string;

  @ApiProperty()
  @Column({ nullable: true })
  pessoaId: number;

  @ApiProperty({ enum: VendedorTipo })
  @Column({ nullable: false })
  tipo: VendedorTipo;

  @ApiProperty({ default: false })
  @Column({ default: false })
  inativo: boolean;

  constructor(partial?: Partial<VendedorEntity>) {
    super();
    Object.assign(this, partial);
  }
}
