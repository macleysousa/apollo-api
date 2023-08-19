import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { TipoFrete } from '../../../../commons/enum/tipo-frete';

@Entity({ name: 'romaneios_fretes' })
export class RomaneioFreteEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  romaneioId: number;

  @ApiProperty()
  @Column()
  tipo: TipoFrete;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valor: number;

  @ApiProperty()
  @Column('int')
  prazo: number;

  @ApiProperty()
  @Column('varchar')
  observacao: string;

  constructor(partial?: Partial<RomaneioFreteEntity>) {
    super();
    Object.assign(this, partial);
  }
}
