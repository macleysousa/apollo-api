import { Test, TestingModule } from '@nestjs/testing';

import { pessoaFakeRepository } from 'src/base-fake/pessoa';
import { pessoaEnderecoFakeRepository } from 'src/base-fake/pessoa-endereco';

import { PessoaService } from '../pessoa.service';

import { CreatePessoaEnderecoDto } from './dto/create-pessoa-endereco.dto';
import { UpdatePessoaEnderecoDto } from './dto/update-pessoa-endereco.dto';
import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';
import { EnderecoTipo } from './enum/endereco-tipo.enum';
import { PessoaEnderecoController } from './pessoa-endereco.controller';
import { PessoaEnderecoService } from './pessoa-endereco.service';

describe('PessoaEnderecoController', () => {
  let controller: PessoaEnderecoController;
  let service: PessoaEnderecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaEnderecoController],
      providers: [
        {
          provide: PessoaEnderecoService,
          useValue: {
            create: jest.fn().mockResolvedValue(pessoaEnderecoFakeRepository.findOne()),
            findById: jest.fn().mockResolvedValue(pessoaEnderecoFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PessoaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    controller = module.get<PessoaEnderecoController>(PessoaEnderecoController);
    service = module.get<PessoaEnderecoService>(PessoaEnderecoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new PessoaEnderecoEntity and return it', async () => {
      const pessoaId = 1;
      const createPessoaEnderecoDto: CreatePessoaEnderecoDto = { tipoEndereco: EnderecoTipo.Comercial };
      const pessoaEndereco = new PessoaEnderecoEntity();
      jest.spyOn(service, 'create').mockResolvedValueOnce(pessoaEndereco);

      const result = await controller.create(pessoaId, createPessoaEnderecoDto);

      expect(service.create).toHaveBeenCalledWith(pessoaId, createPessoaEnderecoDto);
      expect(result).toEqual(pessoaEndereco);
    });
  });

  describe('findOne', () => {
    it('should find and return a PessoaEnderecoEntity by pessoaId', async () => {
      const pessoaId = 1;
      const pessoaEndereco = new PessoaEnderecoEntity();
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoaEndereco);

      const result = await controller.findOne(pessoaId);

      expect(service.findById).toHaveBeenCalledWith(pessoaId);
      expect(result).toEqual(pessoaEndereco);
    });
  });

  describe('update', () => {
    it('should update and return a PessoaEnderecoEntity by pessoaId', async () => {
      const pessoaId = 1;
      const updatePessoaEnderecoDto: UpdatePessoaEnderecoDto = { tipoEndereco: EnderecoTipo.Comercial };
      const pessoaEndereco = new PessoaEnderecoEntity();
      jest.spyOn(service, 'update').mockResolvedValueOnce(pessoaEndereco);

      const result = await controller.update(pessoaId, updatePessoaEnderecoDto);

      expect(service.update).toHaveBeenCalledWith(pessoaId, updatePessoaEnderecoDto);
      expect(result).toEqual(pessoaEndereco);
    });
  });

  describe('delete', () => {
    it('should delete a PessoaEnderecoEntity by pessoaId', async () => {
      const pessoaId = 1;
      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      const result = await controller.delete(pessoaId);

      expect(service.delete).toHaveBeenCalledWith(pessoaId);
      expect(result).toBeUndefined();
    });
  });
});
