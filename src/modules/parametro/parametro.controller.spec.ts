import { Test, TestingModule } from '@nestjs/testing';

import { ParametroEntity } from './entities/parametro.entity';
import { ParametroController } from './parametro.controller';
import { ParametroService } from './parametro.service';

describe('ParametroController', () => {
  let controller: ParametroController;
  let service: ParametroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParametroController],
      providers: [
        {
          provide: ParametroService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ParametroController>(ParametroController);
    service = module.get<ParametroService>(ParametroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should call service.find with the correct parameters', async () => {
      const id = 'CD_PRECO_PADRAO';
      const descricao = 'Tabela de preço padrão';
      const expectedResult: ParametroEntity[] = [
        { id: 'CD_PRECO_PADRAO', descricao: 'Tabela de preço padrão', valorPadrao: '0' },
      ];
      jest.spyOn(service, 'find').mockResolvedValueOnce(expectedResult);

      const result = await controller.find(id, descricao);

      expect(service.find).toHaveBeenCalledWith(id, descricao);
      expect(result).toBe(expectedResult);
    });

    it('should call service.find with empty parameters if none are provided', async () => {
      const expectedResult: ParametroEntity[] = [
        { id: 'CD_PRECO_PADRAO', descricao: 'Tabela de preço padrão', valorPadrao: '0' },
      ];
      jest.spyOn(service, 'find').mockResolvedValueOnce(expectedResult);

      const result = await controller.find();

      expect(service.find).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toBe(expectedResult);
    });
  });
});
