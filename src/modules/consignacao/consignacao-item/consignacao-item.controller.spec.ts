import { Test, TestingModule } from '@nestjs/testing';
import { ConsignacaoItemController } from './consignacao-item.controller';
import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';

describe('ConsignacaoItemController', () => {
  let controller: ConsignacaoItemController;
  let service: ConsignacaoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignacaoItemController],
      providers: [
        {
          provide: ConsignacaoItemService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConsignacaoItemController>(ConsignacaoItemController);
    service = module.get<ConsignacaoItemService>(ConsignacaoItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should return all consignacao items when no filter is provided', async () => {
      const expectedItems: ConsignacaoItemEntity[] = [{ consignacaoId: 1 }, { consignacaoId: 2 }] as ConsignacaoItemEntity[];
      const filter: ConsignacaoItemFilter = {};

      jest.spyOn(service, 'find').mockResolvedValueOnce(expectedItems);

      const result = await controller.findAll(filter);

      expect(service.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual(expectedItems);
    });
  });
});
