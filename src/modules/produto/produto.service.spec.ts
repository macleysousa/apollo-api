import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { productFakeRepository } from 'src/base-fake/product';
import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';

import { CategoriaService } from '../categoria/categoria.service';
import { SubCategoriaService } from '../categoria/sub/sub.service';
import { CorService } from '../cor/cor.service';
import { ReferenciaService } from '../referencia/referencia.service';
import { TamanhoService } from '../tamanho/tamanho.service';

import { CodigoBarrasService } from './codigo-barras/codigo-barras.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ImportProdutoDto } from './dto/import-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';
import { ProdutoService } from './produto.service';
import { ProdutoComPrecoView } from './views/produto-com-preco.view';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({ paginate: jest.fn().mockResolvedValue(productFakeRepository.findPaginate()) }));

describe('ProductService', () => {
  let service: ProdutoService;
  let repository: Repository<ProdutoEntity>;
  let viewProdutoComPreco: Repository<ProdutoComPrecoView>;
  let categoriaService: CategoriaService;
  let subCategoriaService: SubCategoriaService;
  let referenciaService: ReferenciaService;
  let corService: CorService;
  let tamanhoService: TamanhoService;
  let codigoBarrasService: CodigoBarrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(ProdutoEntity),
          useValue: {
            upsert: jest.fn().mockResolvedValue(undefined),
            save: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(productFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            delete: jest.fn().mockResolvedValue(Promise<void>),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              cache: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
              clone: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
          },
        },
        {
          provide: getRepositoryToken(ProdutoComPrecoView),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CategoriaService,
          useValue: {
            upsert: jest.fn().mockResolvedValue([{ id: 1, nome: 'CALCINHA' }]),
          },
        },
        {
          provide: SubCategoriaService,
          useValue: {
            upsert: jest.fn().mockResolvedValue([{ categoriaId: 1, id: 1, nome: 'KIT CALCA' }]),
          },
        },
        {
          provide: ReferenciaService,
          useValue: {
            upsert: jest.fn().mockResolvedValue([{ id: 1, nome: 'LINGERIE KIT CALCA BASIC' }]),
          },
        },
        {
          provide: CorService,
          useValue: {
            upsert: jest.fn().mockResolvedValue([{ id: 1, nome: 'SORTIDAS' }]),
          },
        },
        {
          provide: TamanhoService,
          useValue: {
            upsert: jest.fn().mockResolvedValue([{ id: 1, nome: 'P' }]),
          },
        },
        {
          provide: CodigoBarrasService,
          useValue: {
            upsert: jest.fn().mockReturnValue([{ produtoId: 1, code: '9990232165268', tipo: 'EAN13' }]),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<ProdutoEntity>>(getRepositoryToken(ProdutoEntity));
    viewProdutoComPreco = module.get<Repository<ProdutoComPrecoView>>(getRepositoryToken(ProdutoComPrecoView));
    categoriaService = module.get<CategoriaService>(CategoriaService);
    subCategoriaService = module.get<SubCategoriaService>(SubCategoriaService);
    referenciaService = module.get<ReferenciaService>(ReferenciaService);
    corService = module.get<CorService>(CorService);
    tamanhoService = module.get<TamanhoService>(TamanhoService);
    codigoBarrasService = module.get<CodigoBarrasService>(CodigoBarrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(viewProdutoComPreco).toBeDefined();
    expect(categoriaService).toBeDefined();
    expect(subCategoriaService).toBeDefined();
    expect(referenciaService).toBeDefined();
    expect(corService).toBeDefined();
    expect(tamanhoService).toBeDefined();
    expect(codigoBarrasService).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert a product without codigoBarras', async () => {
      // Arrange
      const dto: CreateProdutoDto[] = [
        {
          referenciaId: 415,
          id: 1,
          idExterno: '1',
          corId: 1,
          tamanhoId: 1,
        },
      ];

      // Act
      const response = await service.upsert(dto);

      // Assert
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: In(dto.map((x) => x.id)) } });

      expect(response).toEqual(productFakeRepository.find());
    });

    it('should upsert a product with codigoBarras', async () => {
      // Arrange
      const dto: CreateProdutoDto[] = [
        {
          referenciaId: 415,
          id: 1,
          idExterno: '1',
          corId: 1,
          tamanhoId: 1,
          codigoBarras: [{ tipo: 'EAN13', codigo: '9990232165268' }],
        },
      ];

      // Act
      const response = await service.upsert(dto);

      // Assert
      expect(codigoBarrasService.upsert).toHaveBeenCalledTimes(1);
      expect(codigoBarrasService.upsert).toHaveBeenCalledWith(dto[0].codigoBarras);

      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: In(dto.map((x) => x.id)) } });

      expect(response).toEqual(productFakeRepository.find());
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Arrange
      const createDto: CreateProdutoDto = { id: 1, corId: 1 };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createDto);

      expect(result).toEqual(productFakeRepository.findOne());
    });

    it('should not create a product error *Product with id ${createDto.id} already exists*', () => {
      // Arrange
      const createDto: CreateProdutoDto = { id: 1, corId: 1 };

      // Act

      // Assert
      expect(service.create(createDto)).rejects.toEqual(
        new BadRequestException(`Product with id ${createDto.id} already exists`),
      );
    });
  });

  describe('find', () => {
    it('should find all products', async () => {
      // Arrange
      const searchTerm = 'test';

      // Act
      const result = await service.find(searchTerm);

      // Assert
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('c');

      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(4);
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.cor', 'cor');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.tamanho', 'tamanho');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.referencia', 'referencia');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.codigos', 'codigo');

      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledTimes(6);
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ id: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ nome: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ idExterno: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ referenciaId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith('referencia.idExterno LIKE :idExterno', {
        idExterno: `%${searchTerm}%`,
      });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith('codigo.code LIKE :codigo', {
        codigo: `%${searchTerm}%`,
      });

      expect(result).toEqual(productFakeRepository.findPaginate());
    });
  });

  describe('findById', () => {
    it('should find a product by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, loadEagerRelations: true });

      expect(result).toEqual(productFakeRepository.findOne());
    });
  });

  describe('findProductWithPrice', () => {
    it('should find a product with price', async () => {
      // Arrange
      const id = 1;
      const tabelaDePrecoId = 1;
      const mockResult = { produtoId: id, tabelaDePrecoId, valor: 10.0 } as ProdutoComPrecoView;

      jest.spyOn(viewProdutoComPreco, 'findOne').mockResolvedValueOnce(mockResult);

      // Act
      const result = await service.findProductWithPrice(id, tabelaDePrecoId);

      // Assert
      expect(viewProdutoComPreco.findOne).toHaveBeenCalledTimes(1);
      expect(viewProdutoComPreco.findOne).toHaveBeenCalledWith({ where: { produtoId: id, tabelaDePrecoId } });

      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      // Arrange
      const productId = 1;
      const updateDto = new UpdateProdutoDto({ name: 'Updated Product 1' });

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);

      expect(result).toEqual(productFakeRepository.findOne());
    });

    it('should not update a product error *Product with id ${id} not found*', () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateProdutoDto = { corId: 1 };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      // Act

      // Assert
      expect(service.update(id, updateDto)).rejects.toEqual(new BadRequestException(`Product with id ${id} not found`));
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      // Arrange
      const productId = 1;

      // Act
      await service.remove(productId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({ id: productId });
    });

    it('should throw BadRequestException *Unable to delete product with id ${id}*', async () => {
      // Arrange
      const productId = 1;
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(() => {
        throw new BadRequestException(`Unable to delete product with id ${productId}`);
      });

      // Act

      // Assert
      expect(service.remove(productId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('import', () => {
    it('should import a product (full)', async () => {
      // Arrange
      const importDto: ImportProdutoDto[] = [
        {
          referenciaId: 415,
          referenciaIdExterno: '400001',
          referenciaNome: 'LINGERIE KIT CALCA BASIC',
          unidadeMedida: UnidadeMedida.UN,
          categoriaNome: 'CALCINHA',
          subCategoriaNome: 'KIT CALCA',
          marcaId: null,
          descricao: null,
          composicao: null,
          cuidados: null,
          produtoId: 1630,
          produtoIdExterno: '1630',
          corNome: 'SORTIDAS',
          tamanhoNome: 'P',
          codigoBarras: [
            {
              tipo: 'EAN13',
              codigo: '9990232165268',
            },
          ],
          precos: [
            {
              tabelaDePrecoId: 1,
              valor: 10.0,
            },
          ],
        },
      ];

      jest.spyOn(service, 'upsert').mockResolvedValueOnce(undefined);

      // Act
      await service.createMany(importDto);

      // Assert
      expect(categoriaService.upsert).toHaveBeenCalledTimes(1);
      expect(subCategoriaService.upsert).toHaveBeenCalledTimes(1);
      expect(referenciaService.upsert).toHaveBeenCalledTimes(1);
      expect(corService.upsert).toHaveBeenCalledTimes(1);
      expect(tamanhoService.upsert).toHaveBeenCalledTimes(1);
      expect(service.upsert).toHaveBeenCalledTimes(1);
    });

    it('should import a product (optional)', async () => {
      // Arrange
      const importDto: ImportProdutoDto[] = [
        {
          referenciaId: 415,
          referenciaIdExterno: null,
          referenciaNome: null,
          unidadeMedida: null,
          categoriaNome: null,
          subCategoriaNome: null,
          marcaId: null,
          descricao: null,
          composicao: null,
          cuidados: null,
          produtoId: 1630,
          produtoIdExterno: '1630',
          corNome: null,
          tamanhoNome: null,
          codigoBarras: null,
        },
      ];

      jest.spyOn(service, 'upsert').mockResolvedValueOnce(undefined);

      // Act
      await service.createMany(importDto);

      // Assert
      expect(categoriaService.upsert).toHaveBeenCalledTimes(1);
      expect(subCategoriaService.upsert).toHaveBeenCalledTimes(1);
      expect(referenciaService.upsert).toHaveBeenCalledTimes(1);
      expect(corService.upsert).toHaveBeenCalledTimes(1);
      expect(tamanhoService.upsert).toHaveBeenCalledTimes(1);
      expect(service.upsert).toHaveBeenCalledTimes(1);
    });
  });
});
