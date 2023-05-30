import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateTerminalDto } from './create-terminal.dto';

export class UpdateTerminalDto extends PartialType(OmitType(CreateTerminalDto, ['id'])) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  inativo: boolean;
}
