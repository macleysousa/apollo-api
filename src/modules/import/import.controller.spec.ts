import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

describe('ImportController', () => {
  let controller: ImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ImportController>(ImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('/import/csv (POST)', () => {
  //   it('should import a list of products from csv', async () => {
  //     // Arrange
  //     const files = [
  //       {
  //         originalname: 'file.csv',
  //         buffer: Buffer.from(
  //           `referenciaId;referenciaIdExterno;referenciaNome;unidadeMedida;categoriaNome;subCategoriaNome;marcaId;descricao;composicao;cuidados;produtoId;produtoIdExterno;corNome;tamanhoNome;codigoBarras
  //         415;400001;LINGERIE KIT CALCA BASIC;UN;CALCINHA;KIT CALCA;;;;
  //         1630;1630;SORTIDAS;P;9990232165268`
  //         ),
  //       },
  //     ] as Express.Multer.File[];

  //     // Act
  //     await controller.importCsv(files);

  //     // Assert
  //     expect(service.importCsv).toHaveBeenCalledTimes(1);
  //     expect(service.importCsv).toHaveBeenCalledWith(files);
  //   });
  // });
});
