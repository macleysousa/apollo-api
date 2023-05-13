import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userFakeRepository } from 'src/base-fake/user';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';
import { UsuarioEntity } from './entities/usuario.entity';
import { Role } from './enums/usuario-tipo.enum';
import { UsuarioSituacao } from './enums/usuario-situacao.enum';
import { UsuarioService } from './usuario.service';

describe('UserService', () => {
  let userService: UsuarioService;
  let userRepository: Repository<UsuarioEntity>;
  let accessRepository: Repository<UsuarioAcessoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(userFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
            save: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn(),
              andWhere: jest.fn(),
              getMany: jest.fn().mockResolvedValue(userFakeRepository.find()),
            }),
          },
        },
        {
          provide: getRepositoryToken(UsuarioAcessoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(userFakeRepository.findAccesses()),
          },
        },
      ],
    }).compile();

    userService = module.get<UsuarioService>(UsuarioService);
    userRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    accessRepository = module.get<Repository<UsuarioAcessoEntity>>(getRepositoryToken(UsuarioAcessoEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(accessRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a User Entity with successful', async () => {
      // Arrange
      const createUserDto: CriarUsuarioDto = {
        usuario: 'username',
        senha: 'password',
        nome: 'name',
        tipo: Role.sysadmin,
        situacao: UsuarioSituacao.ativo,
      };

      // Act
      const response = await userService.create(createUserDto);

      // Assert
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({ ...createUserDto });
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should return a list User Entity with successful', async () => {
      // Arrange
      const nome = 'name generic';

      // Act
      const response = await userService.find(nome);

      // Assert
      expect(userRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(userRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
      expect(userRepository.createQueryBuilder().where).toHaveBeenCalledWith({ id: Not(IsNull()) });
      expect(userRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);
      expect(userRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ nome: ILike(`%${nome ?? ''}%`) });
      expect(response).toEqual(userFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should return a User Entity with successful by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const response = await userService.findById(id);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });

  describe('findByUserName', () => {
    it('should return a User Entity with successful by username', async () => {
      // Arrange
      const usuario = 'username';

      // Act
      const response = await userService.findByUserName(usuario);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { usuario } });
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });

  describe('findAccesses', () => {
    it('should return a list User Access Entity with successful', async () => {
      // Arrange
      const id = 1;
      const filter = { empresId: undefined, componenteId: undefined };

      // Act
      const response = await userService.findAccesses(id, filter);

      // Assert
      expect(accessRepository.find).toHaveBeenCalledTimes(1);
      expect(accessRepository.find).toHaveBeenCalledWith({ where: { id } });

      expect(response).toEqual(userFakeRepository.findAccesses());
    });
  });

  describe('update', () => {
    it('should update a User Entity with successful', async () => {
      // Arrange
      const id = 1;
      const updateUserDto: AtualizarUsuarioDto = {
        senha: 'password',
        nome: 'john doe',
        tipo: Role.sysadmin,
        situacao: UsuarioSituacao.ativo,
      };

      // Act
      const response = await userService.update(id, updateUserDto);

      // Assert
      expect(userRepository.update).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledWith(id, { ...updateUserDto });
      expect(response).toEqual({ ...userFakeRepository.findOne(), ...updateUserDto });
    });
  });

  describe('validateUser', () => {
    it('should return an error when validating the user *usuario ou senha inválida*', async () => {
      // Arrange
      const usuario = 'username';
      const senha = '';

      // Act

      // Assert
      expect(userService.validateUser(usuario, senha)).rejects.toEqual(new UnauthorizedException('usuario ou senha inválida'));
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { usuario } });
    });

    it('should return a successful when validating the user', async () => {
      // Arrange
      const usuario = 'username';
      const senha = 'password';

      // Act
      const response = await userService.validateUser(usuario, senha);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { usuario } });
      expect(response).toEqual(userFakeRepository.findOne());
    });
  });
});
