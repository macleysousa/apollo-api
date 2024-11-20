import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePessoaDto } from './create-pessoa.dto';

export class UpdatePessoaDto extends PartialType(OmitType(CreatePessoaDto, ['id', 'documento'])) {}
