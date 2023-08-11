import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

import { UpSertPrecoReferenciaDto } from './upsert-referencia.dto';

export class ImportPrecoDto extends UpSertPrecoReferenciaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsTabelaDePreco()
  tabelaPrecoId?: number;
}
