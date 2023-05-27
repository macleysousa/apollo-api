import { Test, TestingModule } from '@nestjs/testing';
import { brandFakeRepository } from 'src/base-fake/brand';
import { MarcaService } from 'src/modules/marca/marca.service';

import { MarcaConstraint } from './is-marca.validation';

describe('Brand validation', () => {
  let brandConstraint: MarcaConstraint;
  let brandService: MarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaConstraint,
        {
          provide: MarcaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    brandConstraint = module.get<MarcaConstraint>(MarcaConstraint);
    brandService = module.get<MarcaService>(MarcaService);
  });

  it('should be defined', () => {
    expect(brandConstraint).toBeDefined();
    expect(brandService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a brand', async () => {
      // Arrange
      const brandId = 1;

      // Act
      const result = await brandConstraint.validate(brandId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid brand', async () => {
      // Arrange
      const brandId = 2;
      jest.spyOn(brandService, 'findById').mockResolvedValue(null);

      // Act
      const result = await brandConstraint.validate(brandId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Act
      const result = brandConstraint.defaultMessage();

      // Assert
      expect(result).toEqual('brand is not valid');
    });
  });
});
