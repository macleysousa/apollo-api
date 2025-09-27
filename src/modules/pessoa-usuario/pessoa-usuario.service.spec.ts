import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioService } from './pessoa-usuario.service';

describe('PessoaUsuarioService', () => {
  let service: PessoaUsuarioService;
  let repository: Repository<PessoaUsuario>;
  let keycloakService: KeycloakService;
  let pessoaService: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaUsuarioService,
        {
          provide: getRepositoryToken(PessoaUsuario),
          useClass: Repository<PessoaUsuario>,
        },
        {
          provide: KeycloakService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            validateToken: jest.fn(),
          },
        },
        {
          provide: PessoaService,
          useValue: {
            findByDocumento: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            pessoaId: jest.fn().mockReturnValue('pessoa-id'),
          },
        },
      ],
    }).compile();

    service = module.get<PessoaUsuarioService>(PessoaUsuarioService);
    repository = module.get<Repository<PessoaUsuario>>(getRepositoryToken(PessoaUsuario));
    keycloakService = module.get<KeycloakService>(KeycloakService);
    pessoaService = module.get<PessoaService>(PessoaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(keycloakService).toBeDefined();
    expect(pessoaService).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      const dto: CreatePessoaUsuarioDto = {
        email: 'test@example.com',
        documento: '123456789',
      } as CreatePessoaUsuarioDto;

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      expect(repository.existsBy).toHaveBeenCalledWith({ email: dto.email });
    });

    it('should throw BadRequestException if documento already exists', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      const dto: CreatePessoaUsuarioDto = {
        email: 'test@example.com',
        documento: '123456789',
      } as CreatePessoaUsuarioDto;

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      expect(repository.existsBy).toHaveBeenCalledWith({ documento: dto.documento });
    });

    it('should register a new user successfully', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(keycloakService, 'register').mockResolvedValue('user-id');
      jest.spyOn(pessoaService, 'findByDocumento').mockResolvedValue({ id: 'pessoa-id' } as any);
      jest.spyOn(repository, 'insert').mockResolvedValue({} as any);

      const dto: CreatePessoaUsuarioDto = {
        email: 'test@example.com',
        documento: '123456789',
        nome: 'mockNome',
        sobrenome: 'mockSobrenome',
      } as CreatePessoaUsuarioDto;

      const result = await service.register(dto);

      expect(result).toBe('Usuário cadastrado com sucesso');
      expect(keycloakService.register).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.senha,
        firstName: dto.nome,
        lastName: dto.sobrenome,
      });
      expect(pessoaService.findByDocumento).toHaveBeenCalledWith(dto.documento);
      expect(repository.insert).toHaveBeenCalledWith({ id: 'user-id', pessoaId: 'pessoa-id', ...dto });
    });
  });

  describe('login', () => {
    it('should throw BadRequestException if login fails', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(keycloakService, 'login').mockResolvedValue(null);

      const dto: LoginPessoaUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
      } as LoginPessoaUsuarioDto;

      await expect(service.login(dto)).rejects.toThrow(BadRequestException);
      expect(keycloakService.login).toHaveBeenCalledWith(dto.email, dto.senha);
    });

    it('should return login response if login succeeds', async () => {
      const mockAccess = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        token_type: 'Bearer',
        expires_in: 3600,
      } as any;

      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(keycloakService, 'login').mockResolvedValue(mockAccess);

      const dto: LoginPessoaUsuarioDto = {
        email: 'test@example.com',
        senha: 'password123',
      } as LoginPessoaUsuarioDto;

      const result = await service.login(dto);

      expect(result).toEqual({
        tokenDeAcesso: mockAccess.access_token,
        tokenDeAtualizacao: mockAccess.refresh_token,
        tipoDeToken: mockAccess.token_type,
        expiracao: expect.any(Date),
      });
      expect(keycloakService.login).toHaveBeenCalledWith(dto.email, dto.senha);
    });
  });

  describe('findPerfil', () => {
    it('should return user profile if token is valid', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id: 'pessoa-id', email: 'test@example.com' } as any);

      const response = await service.findPerfil();

      expect(response).toEqual({ id: 'pessoa-id', email: 'test@example.com' });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'pessoa-id' } });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const response = await service.findPerfil();

      expect(response).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'pessoa-id' } });
    });
  });

  describe('validateToken', () => {
    it('should validate token and return user', async () => {
      jest.spyOn(keycloakService, 'validateToken').mockResolvedValue('user-id');
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id: 'user-id' } as any);

      const response = await service.validateToken('mock-token');
      expect(response).toEqual({ id: 'user-id' });
      expect(keycloakService.validateToken).toHaveBeenCalledWith('mock-token');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id' }, cache: true });
    });
  });
});
