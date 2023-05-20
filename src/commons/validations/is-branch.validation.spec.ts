import { Test, TestingModule } from '@nestjs/testing';
import { branchFakeRepository } from 'src/base-fake/branch';
import { EmpresaService } from 'src/modules/empresa/empresa.service';

import { BranchConstraint } from './is-branch.validation';

describe('Branch validation', () => {
  let branchConstraint: BranchConstraint;
  let branchService: EmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchConstraint,
        {
          provide: EmpresaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(branchFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    branchConstraint = module.get<BranchConstraint>(BranchConstraint);
    branchService = module.get<EmpresaService>(EmpresaService);
  });

  it('should be defined', () => {
    expect(branchConstraint).toBeDefined();
    expect(branchService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a branch', async () => {
      // Arrange
      const branchId = 1;

      // Act
      const result = await branchConstraint.validate(branchId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid branch', async () => {
      // Arrange
      const branchId = 2;
      jest.spyOn(branchService, 'findById').mockResolvedValue(null);

      // Act
      const result = await branchConstraint.validate(branchId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Act
      const result = branchConstraint.defaultMessage();

      // Assert
      expect(result).toEqual('branch not found');
    });
  });
});
