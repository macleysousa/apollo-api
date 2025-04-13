import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
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
          },
        },
        {
          provide: PessoaService,
          useValue: {
            findByDocumento: jest.fn(),
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
      } as CreatePessoaUsuarioDto;

      const result = await service.register(dto);

      expect(result).toBe('Usuário cadastrado com sucesso');
      expect(keycloakService.register).toHaveBeenCalledWith(dto);
      expect(pessoaService.findByDocumento).toHaveBeenCalledWith(dto.documento);
      expect(repository.insert).toHaveBeenCalledWith({ id: 'user-id', pessoaId: 'pessoa-id', ...dto });
    });
  });

  describe('find', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }] as PessoaUsuario[];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.find();

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1' } as PessoaUsuario;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findById('1');

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
