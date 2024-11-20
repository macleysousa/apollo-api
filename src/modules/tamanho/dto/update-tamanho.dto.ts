import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateTamanhoDto } from './create-tamanho.dto';

export class UpdateTamanhoDto extends PartialType(OmitType(CreateTamanhoDto, ['id'] as const)) {}
