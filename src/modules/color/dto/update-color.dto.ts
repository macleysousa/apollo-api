import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(OmitType(CreateColorDto, ['id'] as const)) {}
