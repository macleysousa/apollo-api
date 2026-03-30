import { RequestContext } from 'nestjs-easy-context';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantRequest } from 'src';

import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

import { ContextService } from './context.service';

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextService],
    }).compile();

    service = await module.resolve<ContextService>(ContextService);
  });

  describe('usuario', () => {
    it('should return the current user', () => {
      const usuario = {} as UsuarioEntity;

      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { usuario }, res: undefined });

      const result = service.usuario();

      expect(result).toBe(usuario);
    });
  });

  describe('empresa', () => {
    it('should return the current branch', () => {
      const empresa = {} as EmpresaEntity;

      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { empresa }, res: undefined });

      const result = service.empresa();

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

  describe('data', () => {
    it('should return the current empresa data', () => {
      const empresa = { data: new Date() } as any;

      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { empresa }, res: undefined });

      const result = service.data();

      expect(result).toEqual(empresa.data);
    });
  });

  describe('parametros', () => {
    it('should return the current empresa parametros', () => {
      const parametros = [] as any;

      jest.spyOn(RequestContext, 'currentContext', 'get').mockReturnValueOnce({ req: { parametros }, res: undefined });

      const result = service.parametros();

      expect(result).toEqual(parametros);
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
      const request = {} as TenantRequest;

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
