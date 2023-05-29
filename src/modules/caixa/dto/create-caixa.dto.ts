import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

export class CreateCaixaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmpresa()
  empresaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  terminalId: number;
}
