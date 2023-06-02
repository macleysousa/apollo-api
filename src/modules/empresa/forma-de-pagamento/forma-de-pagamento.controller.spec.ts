import { Test, TestingModule } from '@nestjs/testing';

import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { AddEmpresaFormaPagamentoDto } from './dto/add-forma-de-pagamento.dto';
import { EmpresaFormaPagamentoController } from './forma-de-pagamento.controller';
import { EmpresaFormaPagamentoService } from './forma-de-pagamento.service';
import { EmpresaService } from '../empresa.service';

describe('EmpresaFormaPagamentoController', () => {
  let controller: EmpresaFormaPagamentoController;
  let service: EmpresaFormaPagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaFormaPagamentoController],
      providers: [
        {
          provide: EmpresaFormaPagamentoService,
          useValue: {
            add: jest.fn(),
            find: jest.fn(),
            findByFormaPagamentoId: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: EmpresaService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<EmpresaFormaPagamentoController>(EmpresaFormaPagamentoController);
    service = module.get<EmpresaFormaPagamentoService>(EmpresaFormaPagamentoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should add a new forma de pagamento to an empresa', async () => {
      const empresaId = 1;
      const addFormaPagamentoDto: AddEmpresaFormaPagamentoDto = { formaPagamentoId: 1 };
      const formaDePagamento = new FormaDePagamentoEntity();

      jest.spyOn(service, 'add').mockResolvedValueOnce(formaDePagamento);

      const result = await controller.addFormaDePagamento(empresaId, addFormaPagamentoDto);

      expect(result).toBe(formaDePagamento);
      expect(service.add).toHaveBeenCalledWith(empresaId, addFormaPagamentoDto);
    });
  });

  describe('/ (GET)', () => {
    it('should find formas de pagamento by empresa id', async () => {
      const empresaId = 1;
      const formaDePagamento = new FormaDePagamentoEntity();

      jest.spyOn(service, 'find').mockResolvedValueOnce([formaDePagamento]);

      const result = await controller.find(empresaId);

      expect(result).toEqual([formaDePagamento]);
      expect(service.find).toHaveBeenCalledWith(empresaId);
    });
  });

  describe('/:id (GET)', () => {
    it('should find a forma de pagamento by empresa id and formaPagamentoId', async () => {
      const empresaId = 1;
      const formaPagamentoId = 1;
      const formaDePagamento = new FormaDePagamentoEntity();

      jest.spyOn(service, 'findByFormaPagamentoId').mockResolvedValueOnce(formaDePagamento);

      const result = await controller.findByFormaPagamentoId(empresaId, formaPagamentoId);

      expect(result).toBe(formaDePagamento);
      expect(service.findByFormaPagamentoId).toHaveBeenCalledWith(empresaId, formaPagamentoId);
    });
  });

  describe('/:id (DELETE)', () => {
    it('should remove a forma de pagamento from an empresa', async () => {
      const empresaId = 1;
      const formaPagamentoId = 1;

      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      await controller.remove(empresaId, formaPagamentoId);

      expect(service.remove).toHaveBeenCalledWith(empresaId, formaPagamentoId);
    });
  });
});
