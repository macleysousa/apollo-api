import { Test, TestingModule } from '@nestjs/testing';

import { categoryFakeRepository } from 'src/base-fake/category';
import { CategoriaService } from 'src/modules/categoria/categoria.service';

import { CategoriaConstraint } from './is-categoria.validation';

describe('Category validation', () => {
  let constraint: CategoriaConstraint;
  let categoryService: CategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaConstraint,
        {
          provide: CategoriaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<CategoriaConstraint>(CategoriaConstraint);
    categoryService = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a category', async () => {
      // Arrange
      const categoryId = 1;

      // Act
      const result = await constraint.validate(categoryId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid category', async () => {
      // Arrange
      const categoryId = 2;
      jest.spyOn(categoryService, 'findById').mockResolvedValue(null);

      // Act
      const result = await constraint.validate(categoryId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Act
      const result = constraint.defaultMessage();

      // Assert
      expect(result).toEqual('Categoria não encontrada');
    });
  });
});
