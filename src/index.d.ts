import { Request } from 'express';

import { EmpresaEntity } from './modules/empresa/entities/empresa.entity';
import { EmpresaParametroView } from './modules/empresa/parametro/views/parametro.view';
import { UserEntity } from './modules/user/entity/user.entity';

declare global {
  namespace Express {
    interface Multer {
      File: import('multer').File;
    }
  }
}

interface TenantRequest extends Request {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
  user?: UserEntity;
  usuario?: UserEntity;
  empresa?: EmpresaEntity;
  parametros?: EmpresaParametroView;
  pessoa?: unknown;
  token?: string;
}

interface LoggedRequest extends TenantRequest {
  user?: UserEntity;
  usuario?: UserEntity;
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
