import { PartialType } from '@nestjs/swagger';

import { CreateBalancoDto } from './create-balanco.dto';

export class UpdateBalancoDto extends PartialType(CreateBalancoDto) {}
