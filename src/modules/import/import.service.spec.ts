import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';
import { ProdutoService } from '../produto/produto.service';
import { PrecoReferenciaService } from '../tabela-de-preco/referencia/referencia.service';

jest.mock('src/commons/parses/csv-to-object', () => ({ parseCsvToProduto: jest.fn() }));

describe('ImportService', () => {
  let service: ImportService;
  let produtoService: ProdutoService;
  let precoReferenciaService: PrecoReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: ProdutoService,
          useValue: {},
        },
        {
          provide: PrecoReferenciaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    produtoService = module.get<ProdutoService>(ProdutoService);
    precoReferenciaService = module.get<PrecoReferenciaService>(PrecoReferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(produtoService).toBeDefined();
    expect(precoReferenciaService).toBeDefined();
  });

  // describe('importCsv', () => {
  //   let mockParseCsv: { parseCsvToProduto: jest.Mock };

  //   beforeEach(() => {
  //     mockParseCsv = require('src/commons/parses/csv-to-object');
  //   });

  //   afterEach(() => {
  //     mockParseCsv.parseCsvToProduto.mockRestore();
  //   });

  //   it('should throw BadRequestException if no files are sent', async () => {
  //     await expect(service.importCsv(null)).rejects.toThrow(BadRequestException);
  //     await expect(service.importCsv([])).rejects.toThrow(BadRequestException);
  //   });

  //   it('should throw BadRequestException if any file is not CSV', async () => {
  //     const files = [{ mimetype: 'text/csv' }, { mimetype: 'text/csv' }, { mimetype: 'application/json' }] as any;
  //     await expect(service.importCsv(files)).rejects.toThrow(BadRequestException);
  //   });

  //   it('should import products from CSV file', async () => {
  //     const files = [{ mimetype: 'text/csv' }] as any;
  //     const produtsDto: ImportProdutoDto[] = [
  //       {
  //         referenciaId: 415,
  //         referenciaIdExterno: '400001',
  //         referenciaNome: 'LINGERIE KIT CALCA BASIC',
  //         unidadeMedida: UnidadeMedida.UN,
  //         categoriaNome: 'CALCINHA',
  //         subCategoriaNome: 'KIT CALCA',
  //         marcaId: null,
  //         descricao: null,
  //         composicao: null,
  //         cuidados: null,
  //         produtoId: 1630,
  //         produtoIdExterno: '1630',
  //         corNome: 'SORTIDAS',
  //         tamanhoNome: 'P',
  //         codigoBarras: [
  //           {
  //             tipo: 'EAN13',
  //             codigo: '9990232165268',
  //           },
  //         ],
  //       },
  //     ];

  //     jest.spyOn(mockParseCsv, 'parseCsvToProduto').mockReturnValueOnce(produtsDto);

  //     await service.importCsv(files);

  //     expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledTimes(1);
  //     expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledWith(expect.anything());
  //     expect(mockSerice).toHaveBeenCalledTimes(1);
  //     expect(mockSerice).toHaveBeenCalledWith(produtsDto);
  //   });

  //   it('should throw BadRequestException if any product is invalid', async () => {
  //     const files = [{ mimetype: 'text/csv' }] as any;
  //     const mockParseCsvToObjet = [{ name: 'Product 1', description: 'Description 1', price: 10.0 }];

  //     jest.spyOn(mockParseCsv, 'parseCsvToProduto').mockReturnValueOnce(mockParseCsvToObjet);

  //     await expect(service.importCsv(files)).rejects.toThrow(BadRequestException);
  //     expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledTimes(1);
  //     expect(mockParseCsv.parseCsvToProduto).toHaveBeenCalledWith(expect.anything());
  //   });
  // });
});
