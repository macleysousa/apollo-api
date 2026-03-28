import { Test, TestingModule } from '@nestjs/testing';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';

import { CreateFormaDePagamentoDto } from './dto/create-forma-de-pagamento.dto';
import { UpdateFormaDePagamentoDto } from './dto/update-forma-de-pagamento.dto';
import { FormaDePagamentoEntity } from './entities/forma-de-pagamento.entity';
import { FormaDePagamentoController } from './forma-de-pagamento.controller';
import { FormaDePagamentoService } from './forma-de-pagamento.service';

describe('FormaDePagamentoController', () => {
  let controller: FormaDePagamentoController;
  let service: FormaDePagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormaDePagamentoController],
      providers: [
        FormaDePagamentoService,
        {
          provide: FormaDePagamentoService,
          useValue: {
            add: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FormaDePagamentoController>(FormaDePagamentoController);
    service = module.get<FormaDePagamentoService>(FormaDePagamentoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new forma de pagamento', async () => {
      const createFormaDePagamentoDto: CreateFormaDePagamentoDto = { descricao: 'Teste', tipo: TipoDocumento.Dinheiro };
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = 1;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(service, 'add').mockResolvedValueOnce(formaDePagamento);

      const result = await controller.create(createFormaDePagamentoDto);

      expect(result).toBe(formaDePagamento);
      expect(service.add).toHaveBeenCalledWith(createFormaDePagamentoDto);
    });
  });

  describe('find', () => {
    it('should find formas de pagamento', async () => {
      const filter = 'Teste';
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = 1;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(service, 'find').mockResolvedValueOnce([formaDePagamento]);

      const result = await controller.find(filter);

      expect(service.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual([formaDePagamento]);
    });
  });

  describe('findById', () => {
    it('should find a forma de pagamento by id', async () => {
      const id = 1;
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = id;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(service, 'findById').mockResolvedValueOnce(formaDePagamento);

      const result = await controller.findById(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(formaDePagamento);
    });
  });

  describe('update', () => {
    it('should update a forma de pagamento', async () => {
      const id = 1;
      const updateFormaDePagamentoDto: UpdateFormaDePagamentoDto = { descricao: 'Teste' };
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = id;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(service, 'update').mockResolvedValueOnce(formaDePagamento);

      const result = await controller.update(id, updateFormaDePagamentoDto);

      expect(service.update).toHaveBeenCalledWith(id, updateFormaDePagamentoDto);
      expect(result).toBe(formaDePagamento);
    });
  });
});
