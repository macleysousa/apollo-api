import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { decrypt, encrypt } from 'src/commons/crypto';

class RedefinirSenhaTemplate {
  @ApiProperty()
  assunto: string;

  @ApiProperty()
  corpo: string;
}

@Entity('sistema_config_smtp')
export class ConfigSmtpEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column('varchar')
  servidor: string;

  @ApiProperty()
  @Column('int')
  porta: number;

  @ApiProperty()
  @Column('varchar')
  usuario: string;

  @ApiProperty()
  @Column('varchar', { transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
  senha: string;

  @ApiProperty({ type: RedefinirSenhaTemplate })
  @Column('json')
  redefinirSenhaTemplate: RedefinirSenhaTemplate;
}
