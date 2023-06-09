import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { IsReferencia } from 'src/commons/validations/is-referencia.validation';

export class UpSertPrecoReferenciaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsReferencia()
  referenciaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'O campo preço deve ser um número valido e com no máximo 4 casas decimais' })
  preco: number;
}
