import { Test, TestingModule } from '@nestjs/testing';

import { PessoaService } from '../pessoa.service';

import { CancelTransacaoPontoDto } from './dto/cancel-transacao-ponto.dto';
import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';
import { TransacaoPontoController } from './transacao-ponto.controller';
import { TransacaoPontoService } from './transacao-ponto.service';

describe('TransacaoPontoController', () => {
  let controller: TransacaoPontoController;
  let service: TransacaoPontoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacaoPontoController],
      providers: [
        {
          provide: TransacaoPontoService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            cancel: jest.fn(),
          },
        },
        {
          provide: PessoaService,
          useValue: {
            findById: jest.fn(),
            findByDocumento: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransacaoPontoController>(TransacaoPontoController);
    service = module.get<TransacaoPontoService>(TransacaoPontoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const pessoaId = 1;
      const dto: CreateTransacaoPontoDto = {
        tipo: 'Crédito',
        quantidade: 100,
      };
      const result = new TransacaoPontoEntity();

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(pessoaId, dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(pessoaId, dto);
    });
  });

  describe('find', () => {
    it('should call service.find with correct parameters', async () => {
      const pessoaId = 1;
      const filter: TransacaoPontoFilter = {
        /* mock properties */
      };
      const result = [new TransacaoPontoEntity()];

      jest.spyOn(service, 'find').mockResolvedValue(result);

      expect(await controller.find(pessoaId, filter)).toBe(result);
      expect(service.find).toHaveBeenCalledWith(pessoaId, filter);
    });
  });

  describe('findById', () => {
    it('should call service.findById with correct parameters', async () => {
      const pessoaId = 1;
      const id = 123;
      const result = new TransacaoPontoEntity();

      jest.spyOn(service, 'findById').mockResolvedValue(result);

      expect(await controller.findById(pessoaId, id)).toBe(result);
      expect(service.findById).toHaveBeenCalledWith(pessoaId, id);
    });
  });

  describe('cancel', () => {
    it('should call service.cancel with correct parameters', async () => {
      const pessoaId = 1;
      const id = 123;
      const dto: CancelTransacaoPontoDto = {
        /* mock properties */
      };

      jest.spyOn(service, 'cancel').mockResolvedValue(undefined);

      await controller.cancel(pessoaId, id, dto);
      expect(service.cancel).toHaveBeenCalledWith(pessoaId, id, dto);
    });
  });
});
