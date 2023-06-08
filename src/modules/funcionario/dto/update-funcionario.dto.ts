import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateFuncionarioDto } from './create-funcionario.dto';

export class UpdateFuncionarioDto extends PartialType(OmitType(CreateFuncionarioDto, ['empresaId', 'id'])) {
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  inativo?: boolean;
}
