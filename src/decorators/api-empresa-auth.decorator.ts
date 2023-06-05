import { SetMetadata } from '@nestjs/common';

export const EMPRESA_KEY = 'empresa-key';
export const ApiEmpresaAuth = () => SetMetadata(EMPRESA_KEY, true);
