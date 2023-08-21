import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn } from 'typeorm';

export class BaseView {
  @ApiProperty()
  @ViewColumn()
  criadoEm?: Date;

  @ApiProperty()
  @ViewColumn()
  atualizadoEm?: Date;
}
