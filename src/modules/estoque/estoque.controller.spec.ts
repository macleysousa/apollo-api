import { Test, TestingModule } from '@nestjs/testing';

import { estoqueFakeRepository } from 'src/base-fake/estoque';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';

describe('EstoqueController', () => {
  let controller: EstoqueController;
  let service: EstoqueService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EstoqueController],
      providers: [
        {
          provide: EstoqueService,
          useValue: {
            find: jest.fn().mockResolvedValue(estoqueFakeRepository.find()),
          },
        },
      ],
    }).compile();

    controller = moduleFixture.get<EstoqueController>(EstoqueController);
    service = moduleFixture.get<EstoqueService>(EstoqueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/saldo (GET)', () => {
    it('should return a paginated list of EstoqueView', async () => {
      const result = await controller.find([1], [2], ['ref1'], [3], ['prod1'], [4], [5], 1, 100);

      expect(result).toEqual(estoqueFakeRepository.find());
    });
  });
});
