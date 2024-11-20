import { PartialType } from '@nestjs/swagger';

import { CreateComponenteGrupoDto } from './criar-componente-grupo.dto';

export class UpdateComponentGroupDto extends PartialType(CreateComponenteGrupoDto) {}
