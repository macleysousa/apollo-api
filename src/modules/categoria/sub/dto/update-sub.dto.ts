import { PartialType } from '@nestjs/swagger';
import { CreateSubCategoriaDto } from './create-sub.dto';

export class UpdateSubCategoriaDto extends PartialType(CreateSubCategoriaDto) {}
