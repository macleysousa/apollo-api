import { BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { empresaFakeRepository } from 'src/base-fake/empresa';
import { userFakeRepository } from 'src/base-fake/user';
import { userGroupAccessFakeRepository } from 'src/base-fake/user-group-access';
import { AuthRequest } from 'src/decorators/current-auth.decorator';

import { AdicionarUsuarioGrupoDto } from './dto/adicionar-usuario-grupo.dto';
import { UsuarioGrupoEntity } from './entities/grupo-acesso.entity';
import { UsuarioGrupoService } from './grupo-acesso.service';

describe('GroupAccessService', () => {
  let service: UsuarioGrupoService;
  let request: AuthRequest;
  let repository: Repository<UsuarioGrupoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioGrupoService,
        {
          provide: REQUEST,
          useValue: {
            usuario: userFakeRepository.findOne(),
            empresa: empresaFakeRepository.findOne(),
          },
        },
        {
          provide: getRepositoryToken(UsuarioGrupoEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<UsuarioGrupoService>(UsuarioGrupoService);
    request = await module.resolve<AuthRequest>(REQUEST);
    repository = module.get<Repository<UsuarioGrupoEntity>>(getRepositoryToken(UsuarioGrupoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(request).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a group access', async () => {
      // Arrange
      const usuarioId = 1;
      const operadorId = request.usuario.id;
      const group: AdicionarUsuarioGrupoDto = { empresaId: 1, grupoId: 1 };

      // Act
      const result = await service.add(usuarioId, group);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ ...group, usuarioId, operadorId });

      expect(result).toEqual(userGroupAccessFakeRepository.findOne());
    });

    it('should throw error when create a group access', async () => {
      // Arrange
      const userId = 1;
      const group: AdicionarUsuarioGrupoDto = { empresaId: 1, grupoId: 1 };
      repository.save = jest.fn().mockRejectedValue(new Error());

      // Act

      // Assert
      expect(service.add(userId, group)).rejects.toEqual(new BadRequestException(`usuário, empresa ou grupo inválido`));
    });
  });

  describe('find', () => {
    it('should find group access', async () => {
      // Arrange
      const usuarioId = 1;
      const relations = ['grupo', 'grupo.itens.componente'];

      // Act
      const result = await service.find(usuarioId);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { usuarioId }, relations });

      expect(result).toEqual(userGroupAccessFakeRepository.find());
    });
  });

  describe('findByBranchId', () => {
    it('should find groups access by branch id', async () => {
      // Arrange
      const usuarioId = 1;
      const empresaId = 1;
      const relations = ['grupo', 'grupo.itens.componente'];

      // Act
      const result = await service.findByBranchId(usuarioId, empresaId);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { usuarioId, empresaId }, relations });

      expect(result).toEqual(userGroupAccessFakeRepository.find());
    });
  });

  describe('findByBranchIdAndGroupId', () => {
    it('should find groups access by branch id and group id', async () => {
      // Arrange
      const usuarioId = 1;
      const empresaId = 1;
      const grupoId = 1;
      const relations = ['grupo', 'grupo.itens.componente'];

      // Act
      const result = await service.findByBranchIdAndGroupId(usuarioId, empresaId, grupoId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { usuarioId, empresaId, grupoId }, relations });

      expect(result).toEqual(userGroupAccessFakeRepository.findOne());
    });
  });

  describe('remove', () => {
    it('should remove group access', async () => {
      // Arrange
      const usuarioId = 1;
      const empresaId = 1;
      const grupoId = 1;

      // Act
      await service.remove(usuarioId, empresaId, grupoId);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ usuarioId, empresaId, grupoId });
    });
  });
});
