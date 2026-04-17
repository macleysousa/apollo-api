import { PartialType } from '@nestjs/swagger';

import { CreateSuprimentoDto } from './create-suprimento.dto';

export class UpdateSuprimentoDto extends PartialType(CreateSuprimentoDto) {}
