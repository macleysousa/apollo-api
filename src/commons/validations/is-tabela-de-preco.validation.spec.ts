import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { TabelaDePrecoService } from 'src/modules/tabela-de-preco/tabela-de-preco.service';

import { TabelaDePrecoConstraint } from './is-tabela-de-preco.validation';

describe('TabelaDePrecoConstraint', () => {
  let constraint: TabelaDePrecoConstraint;
  let service: TabelaDePrecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TabelaDePrecoConstraint,
        {
          provide: TabelaDePrecoService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    constraint = module.get<TabelaDePrecoConstraint>(TabelaDePrecoConstraint);
    service = module.get<TabelaDePrecoService>(TabelaDePrecoService);
  });

  describe('validate', () => {
    it('should return true if tabela de preco exists', async () => {
      const value = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);

      const result = await constraint.validate(value);

      expect(result).toBe(true);
      expect(service.findById).toHaveBeenCalledWith(value);
    });

    it('should return false if tabela de preco does not exist', async () => {
      const value = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      const result = await constraint.validate(value);

      expect(result).toBe(false);
      expect(service.findById).toHaveBeenCalledWith(value);
    });
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      const validationArguments = { value: 1 } as ValidationArguments;

      const result = constraint.defaultMessage(validationArguments);

      expect(result).toBe(`Tabela de preço "${validationArguments.value}" não encontrada`);
    });
  });
});
