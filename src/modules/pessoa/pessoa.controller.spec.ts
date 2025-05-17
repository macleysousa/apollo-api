import { Test } from '@nestjs/testing';

import { empresaFakeRepository } from 'src/base-fake/empresa';
import { pessoaFakeRepository } from 'src/base-fake/pessoa';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { LiberarEmpresaAcessoDto } from './dto/liberar-empresa-acesso.dto';
import { PessoaTipo } from './enum/pessoa-tipo.enum';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

describe('PessoaController', () => {
  let controller: PessoaController;
  let service: PessoaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PessoaController],
      providers: [
        {
          provide: PessoaService,
          useValue: {
            create: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(pessoaFakeRepository.findPaginate()),
            findById: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            findByDocumento: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            block: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            unblock: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            liberarAcesso: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<PessoaController>(PessoaController);
    service = moduleRef.get<PessoaService>(PessoaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new pessoa', async () => {
      // Arrange
      const createPessoaDto: CreatePessoaDto = {
        nome: 'John Doe',
        documento: '123456789',
        tipo: PessoaTipo.Física,
      };

      const empresa = empresaFakeRepository.findOne();

      const pessoa = pessoaFakeRepository.findOne();

      jest.spyOn(service, 'create').mockResolvedValueOnce(pessoa);

      // Act
      const result = await controller.create(empresa, createPessoaDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(empresa.id, createPessoaDto);
      expect(result).toEqual(pessoa);
    });
  });

  describe('/ (GET)', () => {
    it('should find pessoas with searchTerm and pagination', async () => {
      // Arrange
      const filter = {};
      const paginationResult = pessoaFakeRepository.findPaginate();
      // Act
      const result = await controller.find(filter);

      // Assert
      expect(service.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual(paginationResult);
    });
  });

  describe('/:id  (GET)', () => {
    it('should find a pessoa by id', async () => {
      // Arrange
      const id = 1;
      const pessoa = pessoaFakeRepository.findOne();

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa);

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(pessoa);
    });
  });

  describe('/:id  (PUT)', () => {
    it('should update a pessoa', async () => {
      // Arrange
      const id = 1;
      const updatePessoaDto: CreatePessoaDto = {
        nome: 'John Doe',
        documento: '123456789',
        tipo: PessoaTipo.Física,
      };

      const pessoa = pessoaFakeRepository.findOne();

      // Act
      const result = await controller.update(id, updatePessoaDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(id, updatePessoaDto);
      expect(result).toEqual(pessoa);
    });
  });

  describe(':documento/documento  (GET)', () => {
    it('should find a pessoa by documento', async () => {
      // Arrange
      const documento = '123456789';
      const pessoa = pessoaFakeRepository.findOne();

      // Act
      const result = await controller.findByDocumento(documento);

      // Assert
      expect(service.findByDocumento).toHaveBeenCalledWith(documento);
      expect(result).toEqual(pessoa);
    });
  });

  describe(':id/bloquear (PUT)', () => {
    it('should block a pessoa', async () => {
      // Arrange
      const id = 1;
      const pessoa = pessoaFakeRepository.findOne();

      // Act
      const result = await controller.block(id);

      // Assert
      expect(service.block).toHaveBeenCalledWith(id);
      expect(result).toEqual(pessoa);
    });
  });

  describe(':id/desbloquear (PUT)', () => {
    it('should unblock a pessoa', async () => {
      // Arrange
      const id = 1;
      const pessoa = pessoaFakeRepository.findOne();

      // Act
      const result = await controller.unblock(id);

      // Assert
      expect(service.unblock).toHaveBeenCalledWith(id);
      expect(result).toEqual(pessoa);
    });
  });

  describe(':id/liberar-acesso (PUT)', () => {
    it('should grant access to a pessoa and return the updated PessoaEntity', async () => {
      // Arrange
      const id = 1;
      const empresaId = 3;
      const pessoa = pessoaFakeRepository.findOne();
      pessoa.empresasAcesso.push(empresaId);

      const dto: LiberarEmpresaAcessoDto = {
        empresaId: empresaId,
      };

      jest.spyOn(service, 'liberarAcesso').mockResolvedValueOnce(pessoa);

      // Act
      const result = await controller.liberarAcesso(id, dto);

      // Assert
      expect(service.liberarAcesso).toHaveBeenCalledWith(id, empresaId);
      expect(result).toEqual(pessoa);
      expect(result.empresasAcesso).toContain(empresaId);
    });
  });
});
