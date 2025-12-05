import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsArray } from 'src/commons/validations/is-array.validation';

import { ConsignacaoIncluirEnum } from '../includes/consignacao.include';

export class ConsignacaoFilterBase {
  @ApiProperty()
  @IsOptional()
  @IsArray('enum', { enum: ConsignacaoIncluirEnum })
  incluir?: ConsignacaoIncluirEnum[];
}
