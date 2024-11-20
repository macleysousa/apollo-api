import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { userFakeRepository } from 'src/base-fake/user';
import { ContextService } from 'src/context/context.service';
import { TerminalService } from 'src/modules/empresa/terminal/terminal.service';

import { TerminalConstraint } from './is-terminal.validation';

describe('TerminalConstraint', () => {
  let constraint: TerminalConstraint;
  let contextService: ContextService;
  let terminalService: TerminalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerminalConstraint,
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue(userFakeRepository.findOne()),
          },
        },
        {
          provide: TerminalService,
          useValue: {
            findById: jest.fn().mockResolvedValue(userFakeRepository.findOneTerminal().terminal),
          },
        },
      ],
    }).compile();
    constraint = module.get<TerminalConstraint>(TerminalConstraint);
    contextService = module.get<ContextService>(ContextService);
    terminalService = module.get<TerminalService>(TerminalService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(contextService).toBeDefined();
    expect(terminalService).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if terminal exists', async () => {
      const value = 1;
      const args = { constraints: [{ validarUsuario: false }] } as ValidationArguments;

      const result = await constraint.validate(value, args);

      expect(contextService.usuario).toHaveBeenCalled();
      expect(terminalService.findById).toHaveBeenCalledWith(undefined, value);
      expect(result).toBe(true);
    });

    it('should return false if terminal does not exist', async () => {
      const value = 1;
      const args = { constraints: [{ validarUsuario: false }] } as ValidationArguments;

      jest.spyOn(terminalService, 'findById').mockResolvedValueOnce(undefined);

      const result = await constraint.validate(value, args);

      expect(contextService.usuario).toHaveBeenCalled();
      expect(terminalService.findById).toHaveBeenCalledWith(undefined, value);
      expect(result).toBe(false);
    });

    it('should return true if usuario has access to terminal', async () => {
      const value = 1;
      const args = { constraints: [{ validarUsuario: false }] } as ValidationArguments;

      const result = await constraint.validate(value, args);

      expect(contextService.usuario).toHaveBeenCalled();
      expect(terminalService.findById).toHaveBeenCalledWith(undefined, value);
      expect(result).toBe(true);
    });

    it('should return false if usuario does not have access to terminal', async () => {
      const value = 1;
      const args = { constraints: [{ validarUsuario: true }] } as ValidationArguments;
      const terminal = { ...userFakeRepository.findOneTerminal().terminal, id: 999 };
      const usuario = { ...userFakeRepository.findOne(), terminais: [terminal] };

      jest.spyOn(contextService, 'usuario').mockReturnValueOnce(usuario);

      const result = await constraint.validate(value, args);

      expect(contextService.usuario).toHaveBeenCalled();
      expect(terminalService.findById).toHaveBeenCalledWith(undefined, value);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the error message', () => {
      const message = 'Terminal não encontrado';
      constraint.messageError = message;

      const result = constraint.defaultMessage();

      expect(result).toBe(message);
    });
  });
});
