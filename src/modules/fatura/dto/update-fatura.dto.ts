import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateFaturaDto } from './create-fatura.dto';

export class UpdateFaturaDto extends PartialType(OmitType(CreateFaturaDto, ['pessoaId'])) {}
