import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { userFakeRepository } from 'src/base-fake/user';

import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuarioSituacao } from './enums/usuario-situacao.enum';
import { Role } from './enums/usuario-tipo.enum';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

describe('UserController', () => {
  let userController: UsuarioController;
  let userService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(userFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
            findAccesses: jest.fn().mockResolvedValue(userFakeRepository.findAccesses()),
            update: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    userController = module.get<UsuarioController>(UsuarioController);
    userService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a User Entity with failed *To create sysadmin user you must have sysadmin access*', async () => {
      // Arrange
      const user = userFakeRepository.findOne();
      user.tipo = Role.administrador;

      const createUserDto: CriarUsuarioDto = {
        usuario: 'username',
        senha: 'password',
        nome: 'name',
        tipo: Role.sysadmin,
        situacao: UsuarioSituacao.ativo,
      };

      // Act

      // Assert

      expect(userController.create(user, createUserDto)).rejects.toEqual(
        new UnauthorizedException('Para criar o usuário do tipo sysadmin, você deve ter acesso sysadmin'),
      );
    });

    it('should create a User Entity with successful', async () => {
      // Arrange
      const user = userFakeRepository.findOne();
      const createUserDto: CriarUsuarioDto = {
        usuario: 'username',
        senha: 'password',
        nome: 'name',
        tipo: Role.sysadmin,
        situacao: UsuarioSituacao.ativo,
      };

      // Act
      const response = await userController.create(user, createUserDto);

      // Assert
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith({ ...createUserDto });
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list User Entity with successful', async () => {
      // Arrange
      const name = 'name generic';

      // Act
      const response = await userController.find(name);

      // Assert
      expect(userService.find).toHaveBeenCalledTimes(1);
      expect(userService.find).toHaveBeenCalledWith(name);
      expect(response).toEqual(userFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a User Entity with successful by id', async () => {
      // Arrange
      const userId = 1;

      // Act
      const response = await userController.findById(userId, { incluir: ['terminais'] });

      // Assert
      expect(userService.findById).toHaveBeenCalledTimes(1);
      expect(userService.findById).toHaveBeenCalledWith(userId, ['terminais']);
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });

  describe('/:id/accesses (GET)', () => {
    it('should return a list Accesses User Entity with successful by id with filter', async () => {
      // Arrange
      const id = 1;
      const empresaId = '1';
      const componente = 'ADMFM001';

      // Act
      const response = await userController.findAccesses(id, empresaId, componente);

      // Assert
      expect(userService.findAccesses).toHaveBeenCalledTimes(1);
      expect(userService.findAccesses).toHaveBeenCalledWith(id, {
        empresaId: empresaId ? Number(empresaId) : null,
        componenteId: componente,
      });
      expect(response).toEqual(userFakeRepository.findAccesses());
    });

    it('should return a list Accesses User Entity with successful by id no filter', async () => {
      // Arrange
      const id = 1;
      const empresaId = undefined;
      const componente = undefined;

      // Act
      const response = await userController.findAccesses(id, empresaId, componente);

      // Assert
      expect(userService.findAccesses).toHaveBeenCalledTimes(1);
      expect(userService.findAccesses).toHaveBeenCalledWith(id, {
        empresaId: empresaId ? Number(empresaId) : null,
        componenteId: componente,
      });
      expect(response).toEqual(userFakeRepository.findAccesses());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a User Entity with failed *To update user to sysadmin you must have sysadmin access*', async () => {
      // Arrange
      const user = userFakeRepository.findOne();
      user.tipo = Role.administrador;
      const userId = 1;
      const updateUserDto: AtualizarUsuarioDto = {
        senha: 'password',
        nome: 'name',
        tipo: Role.sysadmin,
        situacao: UsuarioSituacao.ativo,
      };

      // Act

      // Assert
      expect(userController.update(user, userId, updateUserDto)).rejects.toEqual(
        new UnauthorizedException('To update user to sysadmin you must have sysadmin access'),
      );
    });

    it('should update a User Entity with successful', async () => {
      // Arrange
      const user = userFakeRepository.findOne();
      const userId = 1;
      const updateUserDto: AtualizarUsuarioDto = {
        senha: 'password',
        nome: 'name',
        tipo: Role.administrador,
        situacao: UsuarioSituacao.ativo,
      };

      // Act
      const response = await userController.update(user, userId, updateUserDto);

      // Assert
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(response).toEqual({ ...userFakeRepository.findOne() });
    });
  });
});
