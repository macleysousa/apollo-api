import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { IsBranch } from 'src/commons/validations/is-branch.validation';

import { IsUsuarioValidation } from 'src/modules/usuario/validations/is-usuario.validation';

export class LoginDTO {
  @IsNotEmpty()
  @IsUsuarioValidation()
  @ApiProperty()
  @MinLength(3)
  usuario: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  senha: string;

  @ApiProperty()
  @IsOptional()
  @IsBranch()
  empresaId?: number;
}
