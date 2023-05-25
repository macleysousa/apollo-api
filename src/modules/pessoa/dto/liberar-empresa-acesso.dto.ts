import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsBetween } from 'src/commons/validations/is-between.validation';

import { IsBranch } from 'src/commons/validations/is-branch.validation';

export class LiberarEmpresaAcessoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsBranch()
  @IsBetween(1, 999, { message: 'O valor deve ser entre 1 e 999' })
  empresaId: number;
}
