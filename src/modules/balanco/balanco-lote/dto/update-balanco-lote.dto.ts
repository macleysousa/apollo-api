import { PartialType } from '@nestjs/swagger';

import { CreateBalancoLoteDto } from './create-balanco-lote.dto';

export class UpdateBalancoLoteDto extends PartialType(CreateBalancoLoteDto) {}
