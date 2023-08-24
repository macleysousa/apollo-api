import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsParametro } from 'src/commons/validations/is-parametro.validation';
import { Parametro } from 'src/modules/parametro/enum/parametros';

export class CreateParametroDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsParametro()
  parametroId: Parametro;

  @ApiProperty()
  @IsNotEmpty()
  valor: string;
}
