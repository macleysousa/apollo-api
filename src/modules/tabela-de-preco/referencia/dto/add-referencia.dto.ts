import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { IsReferencia } from 'src/commons/validations/is-referencia.validation';

export class AddPrecoReferenciaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "referência" é obrigatório' })
  @IsReferencia()
  referenciaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "valor" é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O campo valor deve ser um número valido e com no máximo 4 casas decimais' })
  valor: number;
}
