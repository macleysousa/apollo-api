import { Test, TestingModule } from '@nestjs/testing';

import { empresaFakeRepository } from 'src/base-fake/empresa';

import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

describe('BranchController', () => {
  let controller: EmpresaController;
  let service: EmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: EmpresaService,
          useValue: {
            create: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(empresaFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmpresaController>(EmpresaController);
    service = module.get<EmpresaService>(EmpresaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a branch', async () => {
      // Arrange
      const branch: CreateEmpresaDto = { id: 1, cnpj: '01.248.473/0001-75', nome: 'branch1', nomeFantasia: 'fantasyName' };

      // Act
      const result = await controller.create(branch);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(branch);

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should get branches no filter', async () => {
      // Arrange
      const filter = '';
      const incluir = ['terminais'] as any;

      // Act
      const result = await controller.find(filter, incluir);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(filter, incluir);

      expect(result).toEqual(empresaFakeRepository.find());
    });

    it('should get branches with filter', async () => {
      // Arrange
      const filter = 'filter';
      const incluir = ['terminais'] as any;

      // Act
      const result = await controller.find(filter, incluir);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(filter, incluir);

      expect(result).toEqual(empresaFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should get a branch by id', async () => {
      // Arrange
      const id = 1;
      const incluir = ['terminais'] as any;

      // Act
      const result = await controller.findById(id, incluir);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id, incluir);

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a branch', async () => {
      // Arrange
      const id = 1;
      const branch: CreateEmpresaDto = { id: 1, cnpj: '01.248.473/0001-75', nome: 'branch1', nomeFantasia: 'fantasyName' };

      // Act
      const result = await controller.update(id, branch);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, branch);

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a branch', async () => {
      // Arrange
      const id = 1;

      // Act
      await controller.remove(id);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
