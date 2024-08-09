import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'pontos' })
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
  @PrimaryColumn('int')
  quantidade: number;

  @ApiProperty()
  @UpdateDateColumn()
  dataDeValidade: Date;



  constructor(partial?: Partial<PontoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
