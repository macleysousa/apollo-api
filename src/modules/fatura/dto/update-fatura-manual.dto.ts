import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateFaturaManualDto } from './create-fatura-manual.dto';

export class UpdateFaturaManualDto extends PartialType(OmitType(CreateFaturaManualDto, ['pessoaId'])) {}
