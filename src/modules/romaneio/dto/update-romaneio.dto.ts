import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateRomaneioDto } from './create-romaneio.dto';

export class UpdateRomaneioDto extends PartialType(OmitType(CreateRomaneioDto, ['operacao'] as const)) {}
