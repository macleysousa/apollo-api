import { Test, TestingModule } from '@nestjs/testing';
import { FuncionarioConstraint } from './is-funcionario.validation';
import { FuncionarioService } from 'src/modules/funcionario/funcionario.service';

describe('FuncionarioConstraint', () => {
  let constraint: FuncionarioConstraint;
  let service: FuncionarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuncionarioConstraint,
        {
          provide: FuncionarioService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    constraint = module.get<FuncionarioConstraint>(FuncionarioConstraint);
    service = module.get<FuncionarioService>(FuncionarioService);
  });

  describe('validate', () => {
    it('should return true if funcionario exists', async () => {
      const value = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: value } as any);

      const result = await constraint.validate(value);

      expect(service.findById).toHaveBeenCalledWith(value);
      expect(result).toBe(true);
    });

    it('should return false if funcionario does not exist', async () => {
      const value = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      const result = await constraint.validate(value);

      expect(service.findById).toHaveBeenCalledWith(value);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const result = constraint.defaultMessage();

      expect(result).toBe('Funcionário não encontrado');
    });
  });
});
