import { AuthRequest } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

import { empresaFakeRepository } from './empresa';
import { userFakeRepository } from './user';

export class AuthRequestFake implements AuthRequest {
  usuario: UsuarioEntity = userFakeRepository.findOne();
  empresa?: EmpresaEntity = empresaFakeRepository.findOne();
  cache: RequestCache;
  credentials: RequestCredentials;
  destination: RequestDestination;
  headers: Headers;
  integrity: string;
  keepalive: boolean;
  method: string;
  mode: RequestMode;
  redirect: RequestRedirect;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  signal: AbortSignal;
  url: string;
  clone(): Request {
    throw new Error('Method not implemented.');
  }
  body: ReadableStream<Uint8Array>;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Method not implemented.');
  }
  blob(): Promise<Blob> {
    throw new Error('Method not implemented.');
  }
  formData(): Promise<FormData> {
    throw new Error('Method not implemented.');
  }
  json(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  text(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export const authRequestFake = new AuthRequestFake();
