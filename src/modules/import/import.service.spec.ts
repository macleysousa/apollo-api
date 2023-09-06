import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';

import { ImportProdutoDto } from '../produto/dto/import-produto.dto';
import { ProdutoService } from '../produto/produto.service';
import { ImportPrecoDto } from '../tabela-de-preco/referencia/dto/import-precos.dto';
import { PrecoReferenciaService } from '../tabela-de-preco/referencia/referencia.service';
import { ImportService } from './import.service';

jest.mock('src/commons/parses/csv-to-object', () => ({ parseCsvToProduto: jest.fn(), parseCsvToRefereciaPreco: jest.fn() }));
jest.mock('src/commons/validate-dto', () => ({ validateDto: jest.fn() }));
jest.mock('src/exceptions/validations.exception', () => ({ ValidationExceptionFactory: jest.fn() }));

describe('ImportService', () => {
  let service: ImportService;
  let produtoService: ProdutoService;
  let precoReferenciaService: PrecoReferenciaService;

  let mockParseCsv: { parseCsvToProduto: jest.Mock; parseCsvToRefereciaPreco: jest.Mock };
  let mockValidateDto: { validateDto: jest.Mock };
  let mockValidationsException: { ValidationExceptionFactory: jest.Mock };

  beforeEach(async () => {
    mockParseCsv = require('src/commons/parses/csv-to-object');
    mockValidateDto = require('src/commons/validate-dto');
    mockValidationsException = require('src/exceptions/validations.exception');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: ProdutoService,
          useValue: {
            createMany: jest.fn(),
          },
        },
        {
          provide: PrecoReferenciaService,
          useValue: {
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    produtoService = module.get<ProdutoService>(ProdutoService);
    precoReferenciaService = module.get<PrecoReferenciaService>(PrecoReferenciaService);
  });

  afterEach(() => {
    mockParseCsv.parseCsvToProduto.mockRestore();
    mockParseCsv.parseCsvToRefereciaPreco.mockRestore();
    mockValidateDto.validateDto.mockRestore();
    mockValidationsException.ValidationExceptionFactory.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(produtoService).toBeDefined();
    expect(precoReferenciaService).toBeDefined();
  });

  describe('produtosCSV', () => {
    it('should throw BadRequestException if no files are sent', async () => {
      await expect(service.produtosCSV(null)).rejects.toThrow(BadRequestException);
      await expect(service.produtosCSV([])).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if any file is not CSV', async () => {
      const files = [{ mimetype: 'text/csv' }, { mimetype: 'text/csv' }, { mimetype: 'application/json' }] as any;
      await expect(service.produtosCSV(files)).rejects.toThrow(BadRequestException);
    });

    it('should import products from CSV file', async () => {
      const files = [{ mimetype: 'text/csv' }] as any;
      const produtsDto: ImportProdutoDto[] = [
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

      jest.spyOn(mockParseCsv, 'parseCsvToProduto').mockReturnValueOnce(produtsDto);
      jest.spyOn(mockValidateDto, 'validateDto').mockReturnValueOnce([]);

      await service.produtosCSV(files);

      expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledTimes(1);
      expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledWith(expect.anything());
      expect(produtoService.createMany).toHaveBeenCalledTimes(1);
      expect(produtoService.createMany).toHaveBeenCalledWith(produtsDto);
    });

    it('should throw BadRequestException if any product is invalid', async () => {
      const files = [{ mimetype: 'text/csv' }] as any;
      const mockParseCsvToObjet = [{ name: 'Product 1', description: 'Description 1', price: 10.0 }];
      const error = ['Error 1'] as any;

      jest.spyOn(mockParseCsv, 'parseCsvToProduto').mockReturnValueOnce(mockParseCsvToObjet);
      jest.spyOn(mockValidateDto, 'validateDto').mockReturnValueOnce(error);
      jest.spyOn(mockValidationsException, 'ValidationExceptionFactory').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(service.produtosCSV(files)).rejects.toThrow(BadRequestException);
      expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledTimes(1);
      expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledWith(expect.anything());
      expect(mockValidateDto.validateDto).toHaveBeenCalledTimes(1);
      expect(mockValidateDto.validateDto).toHaveBeenCalledWith(ImportProdutoDto, mockParseCsvToObjet);
      expect(mockValidationsException.ValidationExceptionFactory).toHaveBeenCalledTimes(1);
      expect(mockValidationsException.ValidationExceptionFactory).toHaveBeenCalledWith(error);
      expect(produtoService.createMany).toHaveBeenCalledTimes(0);
    });
  });

  describe('precosReferenciaCSV', () => {
    it('should throw BadRequestException if no files are sent', async () => {
      await expect(service.referenciasPrecoCsv(null)).rejects.toThrow(BadRequestException);
      await expect(service.referenciasPrecoCsv([])).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if any file is not CSV', async () => {
      const files = [{ mimetype: 'text/csv' }, { mimetype: 'text/csv' }, { mimetype: 'application/json' }] as any;
      await expect(service.referenciasPrecoCsv(files)).rejects.toThrow(BadRequestException);
    });

    it('should import preco referencia from CSV file', async () => {
      const files = [{ mimetype: 'text/csv' }] as any;
      const importPrecoDto: ImportPrecoDto[] = [{ tabelaDePrecoId: 1, referenciaId: 1, valor: 10.0 }];

      jest.spyOn(mockParseCsv, 'parseCsvToRefereciaPreco').mockReturnValueOnce(importPrecoDto);
      jest.spyOn(mockValidateDto, 'validateDto').mockReturnValueOnce([]);

      await service.referenciasPrecoCsv(files);

      expect(mockParseCsv.parseCsvToRefereciaPreco).toHaveBeenCalledTimes(1);
      expect(mockParseCsv.parseCsvToRefereciaPreco).toHaveBeenCalledWith(expect.anything());
      expect(mockValidateDto.validateDto).toHaveBeenCalledTimes(1);
      expect(mockValidateDto.validateDto).toHaveBeenCalledWith(ImportPrecoDto, importPrecoDto);
      expect(precoReferenciaService.upsert).toHaveBeenCalledTimes(1);
      expect(precoReferenciaService.upsert).toHaveBeenCalledWith(importPrecoDto);
    });

    it('should throw BadRequestException if any preco referencia is invalid', async () => {
      const files = [{ mimetype: 'text/csv' }] as any;
      const importPrecoDto: ImportPrecoDto[] = [{ tabelaDePrecoId: 1, referenciaId: 1, valor: 10.0 }];
      const error = ['Error 1'] as any;

      jest.spyOn(mockParseCsv, 'parseCsvToRefereciaPreco').mockReturnValueOnce(importPrecoDto);
      jest.spyOn(mockValidateDto, 'validateDto').mockReturnValueOnce(error);
      jest.spyOn(mockValidationsException, 'ValidationExceptionFactory').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(service.referenciasPrecoCsv(files)).rejects.toThrow(BadRequestException);
      expect(mockParseCsv.parseCsvToRefereciaPreco).toHaveBeenCalledTimes(1);
      expect(mockParseCsv.parseCsvToRefereciaPreco).toHaveBeenCalledWith(expect.anything());
      expect(mockValidateDto.validateDto).toHaveBeenCalledTimes(1);
      expect(mockValidateDto.validateDto).toHaveBeenCalledWith(ImportPrecoDto, importPrecoDto);
      expect(mockValidationsException.ValidationExceptionFactory).toHaveBeenCalledTimes(1);
      expect(mockValidationsException.ValidationExceptionFactory).toHaveBeenCalledWith(error);
      expect(precoReferenciaService.upsert).toHaveBeenCalledTimes(0);
    });
  });
});
