import { SetMetadata } from '@nestjs/common';

export const PESSOA_KEY = 'pessoa-key';
export const ApiPessoa = () => SetMetadata(PESSOA_KEY, true);
