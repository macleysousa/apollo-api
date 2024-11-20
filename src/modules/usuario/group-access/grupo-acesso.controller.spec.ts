import { Test, TestingModule } from '@nestjs/testing';

import { userGroupAccessFakeRepository } from 'src/base-fake/user-group-access';

import { AdicionarUsuarioGrupoDto } from './dto/adicionar-usuario-grupo.dto';
import { UsuarioGrupoController } from './grupo-acesso.controller';
import { UsuarioGrupoService } from './grupo-acesso.service';

describe('GroupAccessController', () => {
  let controller: UsuarioGrupoController;
  let service: UsuarioGrupoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioGrupoController],
      providers: [
        {
          provide: UsuarioGrupoService,
          useValue: {
            add: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.find()),
            findByBranchId: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
            findByBranchIdAndGroupId: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuarioGrupoController>(UsuarioGrupoController);
    service = module.get<UsuarioGrupoService>(UsuarioGrupoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/:id/group-accesses (POST)', () => {
    it('should add a new user group access', async () => {
      // Arrange
      const userId = 1;
      const access: AdicionarUsuarioGrupoDto = { empresaId: 1, grupoId: 1 };

      // Act
      const result = await controller.add(userId, access);

      // Assert
      expect(service.add).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenCalledWith(userId, access);

      expect(result).toEqual(userGroupAccessFakeRepository.findOne());
    });
  });

  describe('/:id/group-accesses (GET)', () => {
    it('should get all user group accesses', async () => {
      // Arrange
      const userId = 1;

      // Act
      const result = await controller.find(userId);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(userId);

      expect(result).toEqual(userGroupAccessFakeRepository.find());
    });
  });

  describe('/:id/group-accesses/:branchId (GET)', () => {
    it('should get user group access by branch id', async () => {
      // Arrange
      const userId = 1;
      const branchId = 1;

      // Act
      const result = await controller.findByBranchId(userId, branchId);

      // Assert
      expect(service.findByBranchId).toHaveBeenCalledTimes(1);
      expect(service.findByBranchId).toHaveBeenCalledWith(userId, branchId);

      expect(result).toEqual(userGroupAccessFakeRepository.findOne());
    });
  });

  describe('/:id/group-accesses/:branchId/:groupId (GET)', () => {
    it('should get user group access by branch id and group id', async () => {
      // Arrange
      const userId = 1;
      const branchId = 1;
      const groupId = 1;

      // Act
      const result = await controller.findByBranchIdAndGroupId(userId, branchId, groupId);

      // Assert
      expect(service.findByBranchIdAndGroupId).toHaveBeenCalledTimes(1);
      expect(service.findByBranchIdAndGroupId).toHaveBeenCalledWith(userId, branchId, groupId);

      expect(result).toEqual(userGroupAccessFakeRepository.findOne());
    });
  });

  describe('/:id/group-accesses/:branchId/:groupId (DELETE)', () => {
    it('should delete user group access by branch id and group id', async () => {
      // Arrange
      const userId = 1;
      const branchId = 1;
      const groupId = 1;

      // Act
      await controller.remove(userId, branchId, groupId);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(userId, branchId, groupId);
    });
  });
});
