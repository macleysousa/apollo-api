import { Test, TestingModule } from '@nestjs/testing';
import { brandFakeRepository } from 'src/base-fake/brand';
import { BrandService } from 'src/modules/brand/brand.service';

import { BrandConstraint } from './is-brand.validation';

describe('Brand validation', () => {
  let brandConstraint: BrandConstraint;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandConstraint,
        {
          provide: BrandService,
          useValue: {
            findById: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    brandConstraint = module.get<BrandConstraint>(BrandConstraint);
    brandService = module.get<BrandService>(BrandService);
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
