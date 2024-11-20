import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { IsBetween } from 'src/commons/validations/is-between.validation';
import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

export class LiberarEmpresaAcessoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsEmpresa()
  @IsBetween(1, 999, { message: 'O valor deve ser entre 1 e 999' })
  empresaId: number;
}
