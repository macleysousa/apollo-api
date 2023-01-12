import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { componentFakeRepository } from 'src/base-fake/component';
import { ComponentService } from '../component.service';
import { IsComponentValidConstraint } from './is-component.validation';

describe('Validation component exist', () => {
  let isComponentValidConstraint: IsComponentValidConstraint;
  let componentService: ComponentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsComponentValidConstraint,
        {
          provide: ComponentService,
          useValue: {
            findById: jest.fn().mockResolvedValue(componentFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    isComponentValidConstraint = module.get<IsComponentValidConstraint>(IsComponentValidConstraint);
    componentService = module.get<ComponentService>(ComponentService);
  });

  it('should be defined', () => {
    expect(isComponentValidConstraint).toBeDefined();
    expect(componentService).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if component exist', async () => {
      // Arrange

      // Act
      const result = await isComponentValidConstraint.validate('ADMFM001');

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false if component not exist', async () => {
      // Arrange
      jest.spyOn(componentService, 'findById').mockResolvedValue(null);

      // Act
      const result = await isComponentValidConstraint.validate('ADMFC001');

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      // Arrange

      // Act
      const result = isComponentValidConstraint.defaultMessage();

      // Assert
      expect(result).toEqual('Component does not exist');
    });
  });
});
