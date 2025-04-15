import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { UsuarioRelation, UsuarioRelationEnum } from '../relations/usuario.relation';

export class UsuarioFilterBase {
  @ApiProperty({ required: false, enum: UsuarioRelationEnum })
  @IsOptional()
  @IsArray('enum', { enum: UsuarioRelationEnum })
  incluir?: UsuarioRelation[];
}
