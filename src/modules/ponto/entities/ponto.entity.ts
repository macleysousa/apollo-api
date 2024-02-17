import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'ponto' })
export class PontoEntity extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  clienteId: number;

  @ApiProperty()
  @UpdateDateColumn()
  dataDeValidade: Date;

  @ApiProperty()
  @UpdateDateColumn({ default: 'now()' })
  dataDeCriacao?: Date;

  constructor(partial?: Partial<PontoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
