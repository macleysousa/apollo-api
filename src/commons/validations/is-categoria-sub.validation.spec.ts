import { Test, TestingModule } from '@nestjs/testing';

import { categoryFakeRepository } from 'src/base-fake/category';
import { SubCategoriaService } from 'src/modules/categoria/sub/sub.service';

import { SubCategoriaConstraint } from './is-categoria-sub.validation';

describe('SubCategoryConstraint', () => {
  let service: SubCategoriaService;
  let constraint: SubCategoriaConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoriaConstraint,
        {
          provide: SubCategoriaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<SubCategoriaConstraint>(SubCategoriaConstraint);
    service = module.get<SubCategoriaService>(SubCategoriaService);
  });

  describe('validate', () => {
    it('should return true if sub category id is valid within category id', async () => {
      // Arrange
      const subCategoryId = 1;
      const args = {
        object: { categoryId: 2 },
        constraints: undefined,
        property: undefined,
        targetName: undefined,
        value: undefined,
      };

      //Act
      const result = await constraint.validate(subCategoryId, args);

      //Assert
      expect(result).toBe(true);
    });

    it('should return false if category id is not specified', async () => {
      // Arrange
      const subCategoryId = 1;
      const args = {
        object: { categoryId: 2 },
        constraints: undefined,
        property: undefined,
        targetName: undefined,
        value: undefined,
      };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      //Act
      const result = await constraint.validate(subCategoryId, args);

      //Assert
      expect(result).toBe(false);
    });

    it('should return false if sub category id is not valid within category id', async () => {
      // Arrange
      const subCategoryId = 1;
      const args = {
        object: {},
        constraints: undefined,
        property: undefined,
        targetName: undefined,
        value: undefined,
      };

      //Act
      const result = await constraint.validate(subCategoryId, args);

      //Assert
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return a default error message', () => {
      // Arrange
      const args = {
        object: { categoryId: 2 },
        constraints: undefined,
        property: undefined,
        targetName: undefined,
        value: undefined,
      };

      //Act
      const result = constraint.defaultMessage(args);

      //Assert
      expect(result).toBe('category or sub category is not valid');
    });
  });
});
