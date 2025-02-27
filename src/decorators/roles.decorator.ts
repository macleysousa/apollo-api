import { SetMetadata } from '@nestjs/common';

import { Role } from '../modules/usuario/enums/usuario-tipo.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...tipos: Role[]) => SetMetadata(ROLES_KEY, tipos);
