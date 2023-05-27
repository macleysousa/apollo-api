import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { IsEmpresa } from 'src/commons/validations/is-empresa.validation';

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
  @IsEmpresa()
  empresaId?: number;
}
