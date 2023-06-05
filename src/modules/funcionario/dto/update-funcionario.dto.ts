import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateFuncionarioDto } from './create-funcionario.dto';

export class UpdateFuncionarioDto extends PartialType(OmitType(CreateFuncionarioDto, ['empresaId', 'id'])) {}
