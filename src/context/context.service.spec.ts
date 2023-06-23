import { Test, TestingModule } from '@nestjs/testing';
import { RequestContext } from 'nestjs-request-context';

import { AuthRequest } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

import { ContextService } from './context.service';

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextService],
    }).compile();

    service = module.get<ContextService>(ContextService);
  });

  describe('currentAuth', () => {
    it('should return the current auth request', () => {
      const authRequest = {} as AuthRequest;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: authRequest, res: undefined });

      const result = service.currentAuth();

      expect(result).toBe(authRequest);
    });
  });

  describe('currentUser', () => {
    it('should return the current user', () => {
      const usuario = {} as UsuarioEntity;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { usuario }, res: undefined });

      const result = service.currentUser();

      expect(result).toBe(usuario);
    });
  });

  describe('currentBranch', () => {
    it('should return the current branch', () => {
      const empresa = {} as EmpresaEntity;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { empresa }, res: undefined });

      const result = service.currentBranch();

      expect(result).toBe(empresa);
    });
  });

  describe('empresaId', () => {
    it('should return the current empresa id', () => {
      const empresa = { id: 1 } as any;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { empresa }, res: undefined });

      const result = service.empresaId();

      expect(result).toEqual(1);
    });
  });

  describe('operadorId', () => {
    it('should return the current operador id', () => {
      const usuario = { id: 1 } as any;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { usuario }, res: undefined });

      const result = service.operadorId();

      expect(result).toEqual(1);
    });
  });

  describe('request', () => {
    it('should return the current request', () => {
      const request = {} as Request;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: request, res: undefined });

      const result = service.request();

      expect(result).toBe(request);
    });
  });

  describe('response', () => {
    it('should return the current response', () => {
      const response = {} as Response;
      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ res: response, req: undefined });

      const result = service.response();

      expect(result).toBe(response);
    });
  });
});
