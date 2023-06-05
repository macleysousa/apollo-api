import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'tabelas_de_precos' })
export class TabelaDePrecoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  inativa: boolean;

  constructor(partial?: Partial<TabelaDePrecoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
