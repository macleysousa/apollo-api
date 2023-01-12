import { Request } from 'express';
import { UserEntity } from './modules/user/entity/user.entity';

interface TenantRequest extends Request {
  id?: number;
  username?: string;
  name?: string;
  role?: string;
}

interface LoggedRequest extends TenantRequest {
  user?: UserEntity;
}

interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: UserEntity;
      params: DynamicObject;
    };
  };
}
