import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CodigoBarrasService } from './codigo-barras.service';
import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';
import { CodigoBarrasEntity } from './entities/codigo-barras.entity';

describe('BarcodeService', () => {
  let service: CodigoBarrasService;
  let repository: Repository<CodigoBarrasEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodigoBarrasService,
        {
          provide: getRepositoryToken(CodigoBarrasEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            upsert: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CodigoBarrasService>(CodigoBarrasService);
    repository = module.get<Repository<CodigoBarrasEntity>>(getRepositoryToken(CodigoBarrasEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert a barcode', async () => {
      // Arrange
      const create: CreateCodigoBarrasDto[] = [{ produtoId: 1, tipo: 'EAN13', codigo: '123' }];

      // Act
      await service.upsert(create);

      // Assert
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a barcode', async () => {
      // Arrange
      const produtoId = 1;
      const create: CreateCodigoBarrasDto = { tipo: 'EAN13', codigo: '123' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act
      await service.create(produtoId, create);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.upsert).toHaveBeenCalledWith(
        { produtoId, codigo: create.codigo },
        { conflictPaths: ['produtoId', 'codigo'] },
      );
    });

    it('should throw when barcode is linked to another product', async () => {
      // Arrange
      const produtoId = 1;
      const create: CreateCodigoBarrasDto = { tipo: 'EAN13', codigo: '123' };
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        produto: {
          id: 2,
          idExterno: 'PRD-2',
          referencia: {
            id: 10,
            idExterno: 'REF-10',
            nome: 'Referencia Teste',
          },
        },
      } as unknown as CodigoBarrasEntity);

      // Act / Assert
      await expect(service.create(produtoId, create)).rejects.toMatchObject(
        new BadRequestException({
          codigo: 'CODIGO_BARRAS_JA_CADASTRADO',
          mensagem: `O código de barras ${create.codigo} já está vinculado a outro produto`,
          codigoBarras: create.codigo,
          produto: {
            id: 2,
            idExterno: 'PRD-2',
            referencia: {
              id: 10,
              idExterno: 'REF-10',
              nome: 'Referencia Teste',
            },
          },
        }),
      );
      expect(repository.upsert).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a barcode', async () => {
      // Arrange
      const produtoId = 1;
      const barcode = '123';

      // Act
      await service.remove(produtoId, barcode);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ produtoId, codigo: barcode });
    });
  });
});
