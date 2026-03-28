import { Test, TestingModule } from '@nestjs/testing';

import { CreateTabelaDePrecoDto } from './dto/create-tabela-de-preco.dto';
import { UpdateTabelaDePrecoDto } from './dto/update-tabela-de-preco.dto';
import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';
import { TabelaDePrecoController } from './tabela-de-preco.controller';
import { TabelaDePrecoService } from './tabela-de-preco.service';

describe('TabelaDePrecoController', () => {
  let controller: TabelaDePrecoController;
  let service: TabelaDePrecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TabelaDePrecoController],
      providers: [
        {
          provide: TabelaDePrecoService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TabelaDePrecoController>(TabelaDePrecoController);
    service = module.get<TabelaDePrecoService>(TabelaDePrecoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tabela de preco', async () => {
      const dto = {} as CreateTabelaDePrecoDto;
      const entity = {} as TabelaDePrecoEntity;

      jest.spyOn(service, 'create').mockResolvedValueOnce(entity);

      const result = await controller.create(dto);

      expect(result).toBe(entity);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('find', () => {
    it('should find tabelas de preco', async () => {
      const nome = 'tabela';
      const inativa = true;
      const entities = [{} as TabelaDePrecoEntity];

      jest.spyOn(service, 'find').mockResolvedValueOnce(entities);

      const result = await controller.find(nome, inativa);

      expect(result).toBe(entities);
      expect(service.find).toHaveBeenCalledWith(nome, inativa);
    });
  });

  describe('findById', () => {
    it('should find a tabela de preco by id', async () => {
      const id = 1;
      const entity = {} as TabelaDePrecoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(entity);

      const result = await controller.findById(id);

      expect(result).toBe(entity);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a tabela de preco', async () => {
      const id = 1;
      const dto = {} as UpdateTabelaDePrecoDto;
      const entity = {} as TabelaDePrecoEntity;

      jest.spyOn(service, 'update').mockResolvedValueOnce(entity);

      const result = await controller.update(id, dto);

      expect(result).toBe(entity);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should delete a tabela de preco', async () => {
      const id = 1;

      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
