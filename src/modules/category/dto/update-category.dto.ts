import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(OmitType(CreateCategoryDto, ['id'] as const)) {}
