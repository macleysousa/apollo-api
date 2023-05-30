import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';

import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

export class CreateTerminalDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsOptional()
  @Length(0, 20)
  nome: string;
}
