import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateReferenciaDto } from './create-referencia.dto';

export class UpdateReferenciaDto extends PartialType(OmitType(CreateReferenciaDto, ['id'] as const)) {}
