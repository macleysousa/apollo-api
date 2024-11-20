import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCategoriaDto } from './create-category.dto';

export class UpdateCategoriaDto extends PartialType(OmitType(CreateCategoriaDto, ['id'] as const)) {}
