import { PartialType } from '@nestjs/swagger';

import { CreateParametroDto } from './create-parametro.dto';

export class UpdateEmpresaParametroDto extends PartialType(CreateParametroDto) {}
