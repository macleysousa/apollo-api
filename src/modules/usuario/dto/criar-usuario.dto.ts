import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { UsuarioSituacao } from '../enums/usuario-situacao.enum';
import { Role } from '../enums/usuario-tipo.enum';
import { IsUsuarioValidation } from '../validations/is-usuario.validation';
import { IsUsuarioUnique } from '../validations/is-usuario-unique.validation';

export class CriarUsuarioDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUsuarioValidation()
  @IsUsuarioUnique()
  @MinLength(3)
  usuario: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  @MaxLength(20)
  senha: string;

  @IsNotEmpty()
  @ApiProperty()
  nome: string;

  @IsNotEmpty()
  @ApiProperty({ enum: Role, default: Role.padrao })
  @IsEnum(Role)
  tipo: Role;

  @IsNotEmpty()
  @ApiProperty({ enum: UsuarioSituacao, default: UsuarioSituacao.ativo })
  situacao: UsuarioSituacao;
}
