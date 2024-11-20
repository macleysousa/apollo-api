import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCorDto } from './create-cor.dto';

export class UpdateCorDto extends PartialType(OmitType(CreateCorDto, ['id'] as const)) {}
