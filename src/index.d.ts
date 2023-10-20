import { Request } from 'express';

import { UserEntity } from './modules/user/entity/user.entity';
import { EmpresaEntity } from './modules/empresa/entities/empresa.entity';
import { EmpresaParametroView } from './modules/empresa/parametro/views/paramentro.view';

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
