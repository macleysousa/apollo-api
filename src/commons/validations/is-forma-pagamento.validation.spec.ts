import { Test, TestingModule } from '@nestjs/testing';

import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';

import { FormaPagamentoConstraint } from './is-forma-pagamento.validation';

describe('FormaPagamentoConstraint', () => {
  let constraint: FormaPagamentoConstraint;
  let service: FormaDePagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormaPagamentoConstraint,
        {
          provide: FormaDePagamentoService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    constraint = module.get<FormaPagamentoConstraint>(FormaPagamentoConstraint);
    service = module.get<FormaDePagamentoService>(FormaDePagamentoService);
  });

  describe('validate', () => {
    it('should return true if forma de pagamento exists', async () => {
      const value = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: value } as any);

      const result = await constraint.validate(value);

      expect(result).toBe(true);
      expect(service.findById).toHaveBeenCalledWith(value);
    });

    it('should return false if forma de pagamento does not exist', async () => {
      const value = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      const result = await constraint.validate(value);

      expect(result).toBe(false);
      expect(service.findById).toHaveBeenCalledWith(value);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const result = constraint.defaultMessage();

      expect(result).toBe('Forma de pagamento não encontrada.');
    });
  });
});
