import { Request } from 'express';

import { EmpresaEntity } from './modules/empresa/entities/empresa.entity';
import { EmpresaParametroView } from './modules/empresa/parametro/views/parametro.view';
import { UserEntity } from './modules/user/entity/user.entity';

interface TenantRequest extends Request {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
}

interface LoggedRequest extends TenantRequest {
  user?: UserEntity;
  empresa?: EmpresaEntity;
  parametros?: EmpresaParametroView;
}

interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: UserEntity;
      params: DynamicObject;
    };
  };
}
