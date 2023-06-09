import { Test, TestingModule } from '@nestjs/testing';

import { ProdutoService } from 'src/modules/produto/produto.service';

import { ProdutoConstraint } from './is-produto.validation';

describe('ProdutoConstraint', () => {
  let constraint: ProdutoConstraint;
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoConstraint,
        {
          provide: ProdutoService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    constraint = module.get<ProdutoConstraint>(ProdutoConstraint);
    service = module.get<ProdutoService>(ProdutoService);
  });

  describe('validate', () => {
    it('should return true if ProdutoService.findById returns a truthy value', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce({} as any);

      const result = await constraint.validate(1);

      expect(result).toBe(true);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should return false if ProdutoService.findById returns a falsy value', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      const result = await constraint.validate(1);

      expect(result).toBe(false);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('defaultMessage', () => {
    it('should return a string', () => {
      const result = constraint.defaultMessage();

      expect(typeof result).toBe('string');
    });
  });
});
