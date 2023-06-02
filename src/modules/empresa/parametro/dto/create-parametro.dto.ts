import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsParametro } from 'src/commons/validations/is-parametro.validation';

export class CreateParametroDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsParametro()
  parametroId: string;

  @ApiProperty()
  @IsNotEmpty()
  valor: string;
}
