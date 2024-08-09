import { Test, TestingModule } from '@nestjs/testing';
import { IsNotEmpty, validate } from 'class-validator';

import { ContextService } from 'src/context/context.service';
import { CaixaService } from 'src/modules/caixa/caixa.service';
import { CaixaSituacao } from 'src/modules/caixa/enum/caixa-situacao.enum';

import { CaixaConstraint, IsCaixa } from './is-caixa.validation';

describe('CaixaConstraint', () => {
  let constraint: CaixaConstraint;
  let caixaService: CaixaService;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaConstraint,
        {
          provide: CaixaService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: 1, terminalId: 1, situacao: CaixaSituacao.aberto }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ terminais: [{ id: 1 }] }),
            empresa: jest.fn().mockReturnValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    constraint = module.get<CaixaConstraint>(CaixaConstraint);
    caixaService = module.get<CaixaService>(CaixaService);
    contextService = module.get<ContextService>(ContextService);
  });

  describe('validate', () => {
    it('should return true if caixa exists and user has access', async () => {
      const usuario = { terminais: [{ id: 1 }] } as any;
      const empresa = { id: 2 } as any;
      const caixa = { terminalId: 1, situacao: CaixaSituacao.aberto } as any;
      const args = { constraints: [{ situacao: 'aberto' }] } as any;

      jest.spyOn(contextService, 'usuario').mockReturnValue(usuario);
      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(caixaService, 'findById').mockResolvedValue(caixa);

      expect(await constraint.validate(3, args)).toBe(true);
      expect(contextService.usuario).toHaveBeenCalled();
      expect(contextService.empresa).toHaveBeenCalled();
      expect(caixaService.findById).toHaveBeenCalledWith(empresa.id, 3);
    });

    it('should return false if caixa does not exist', async () => {
      const usuario = { terminais: [{ id: 1 }] } as any;
      const empresa = { id: 2 } as any;
      const args = { constraints: [{ situacao: 'aberto' }] } as any;

      jest.spyOn(contextService, 'usuario').mockReturnValue(usuario);
      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(caixaService, 'findById').mockResolvedValue(undefined);

      expect(await constraint.validate(3, args)).toBe(false);
      expect(contextService.usuario).toHaveBeenCalled();
      expect(contextService.empresa).toHaveBeenCalled();
      expect(caixaService.findById).toHaveBeenCalledWith(empresa.id, 3);
      expect(constraint.messageError).toBe('Caixa não encontrado');
    });

    it('should return false if user does not have access to caixa', async () => {
      const usuario = { terminais: [{ id: 1 }] } as any;
      const empresa = { id: 2 } as any;
      const caixa = { terminalId: 3, situacao: CaixaSituacao.aberto } as any;
      const args = { constraints: [{ situacao: 'aberto' }] } as any;

      jest.spyOn(contextService, 'usuario').mockReturnValue(usuario);
      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(caixaService, 'findById').mockResolvedValue(caixa);

      expect(await constraint.validate(4, args)).toBe(false);
      expect(contextService.usuario).toHaveBeenCalled();
      expect(contextService.empresa).toHaveBeenCalled();
      expect(caixaService.findById).toHaveBeenCalledWith(empresa.id, 4);
      expect(constraint.messageError).toBe('Usuário não possui acesso ao caixa');
    });

    it('should return false if caixa is not aberto', async () => {
      const usuario = { terminais: [{ id: 1 }] } as any;
      const empresa = { id: 2 } as any;
      const caixa = { terminalId: 1, situacao: CaixaSituacao.fechado } as any;
      const validationArguments = { constraints: [{ situacao: 'aberto' }] } as any;

      jest.spyOn(contextService, 'usuario').mockReturnValue(usuario);
      jest.spyOn(contextService, 'empresa').mockReturnValue(empresa);
      jest.spyOn(caixaService, 'findById').mockResolvedValue(caixa);

      expect(await constraint.validate(5, validationArguments)).toBe(false);
      expect(contextService.usuario).toHaveBeenCalled();
      expect(contextService.empresa).toHaveBeenCalled();
      expect(caixaService.findById).toHaveBeenCalledWith(empresa.id, 5);
      expect(constraint.messageError).toBe(`Caixa não está uma situação válida: ${CaixaSituacao.aberto}`);
    });
  });

  describe('defaultMessage', () => {
    it('should return the message error', () => {
      constraint.messageError = 'Test message error';
      expect(constraint.defaultMessage()).toBe('Test message error');
    });
  });
});

describe('IsCaixa', () => {
  it('should call registerDecorator with params', async () => {
    class TestClass {
      @IsNotEmpty()
      @IsCaixa()
      caixaId: number;
    }

    const instance = new TestClass();
    instance.caixaId = 1;

    const result = await validate(instance, { groups: ['test'] });

    expect(result.length).toBeGreaterThan(0);
  });
});
