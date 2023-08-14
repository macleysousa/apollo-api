import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsTabelaDePreco } from 'src/commons/validations/is-tabela-de-preco.validation';

import { AddPrecoReferenciaDto } from './add-referencia.dto';

export class ImportPrecoDto extends AddPrecoReferenciaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Campo "tabelaDePrecoId" é obrigatório.' })
  @IsTabelaDePreco()
  tabelaDePrecoId?: number;
}
