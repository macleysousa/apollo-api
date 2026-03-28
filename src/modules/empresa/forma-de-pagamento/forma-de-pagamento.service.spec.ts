import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { AddEmpresaFormaPagamentoDto } from './dto/add-forma-de-pagamento.dto';
import { EmpresaFormaPagamentoEntity } from './entities/forma-de-pagamento.entity';
import { EmpresaFormaPagamentoService } from './forma-de-pagamento.service';

describe('EmpresaFormaPagamentoService', () => {
  let service: EmpresaFormaPagamentoService;
  let repository: Repository<EmpresaFormaPagamentoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaFormaPagamentoService,
        {
          provide: getRepositoryToken(EmpresaFormaPagamentoEntity),
          useValue: {
            upsert: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmpresaFormaPagamentoService>(EmpresaFormaPagamentoService);
    repository = module.get<Repository<EmpresaFormaPagamentoEntity>>(getRepositoryToken(EmpresaFormaPagamentoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    it('should add a new forma de pagamento to an empresa', async () => {
      const empresaId = 1;
      const addFormaPagamentoDto: AddEmpresaFormaPagamentoDto = { formaPagamentoId: 1 };
      const empresaFormaPagamento = new EmpresaFormaPagamentoEntity({
        empresaId,
        formaPagamentoId: addFormaPagamentoDto.formaPagamentoId,
        formaDePagamento: new FormaDePagamentoEntity(),
      });

      jest.spyOn(repository, 'upsert').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findByFormaPagamentoId').mockResolvedValueOnce(empresaFormaPagamento.formaDePagamento);

      const result = await service.add(empresaId, addFormaPagamentoDto);

      expect(repository.upsert).toHaveBeenCalledWith(
        { ...addFormaPagamentoDto, empresaId },
        { conflictPaths: ['empresaId', 'formaPagamentoId'] },
      );
      expect(service.findByFormaPagamentoId).toHaveBeenCalledWith(empresaId, addFormaPagamentoDto.formaPagamentoId);
      expect(result).toBe(empresaFormaPagamento.formaDePagamento);
    });
  });

  describe('find', () => {
    it('should find formas de pagamento by empresa id', async () => {
      const empresaId = 1;
      const empresaFormaPagamento = new EmpresaFormaPagamentoEntity({
        empresaId,
        formaPagamentoId: 1,
        formaDePagamento: new FormaDePagamentoEntity(),
      });

      jest.spyOn(repository, 'find').mockResolvedValueOnce([empresaFormaPagamento]);

      const result = await service.find(empresaId);

      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId } });
      expect(result).toEqual([empresaFormaPagamento.formaDePagamento]);
    });
  });

  describe('findByFormaPagamentoId', () => {
    it('should find a forma de pagamento by empresa id and formaPagamentoId', async () => {
      const empresaId = 1;
      const formaPagamentoId = 1;
      const empresaFormaPagamento = new EmpresaFormaPagamentoEntity({
        empresaId,
        formaPagamentoId,
        formaDePagamento: new FormaDePagamentoEntity(),
      });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(empresaFormaPagamento);

      const result = await service.findByFormaPagamentoId(empresaId, formaPagamentoId);

      expect(result).toBe(empresaFormaPagamento.formaDePagamento);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, formaPagamentoId } });
    });

    it('should return undefined if forma de pagamento not found', async () => {
      const empresaId = 1;
      const formaPagamentoId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await service.findByFormaPagamentoId(empresaId, formaPagamentoId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, formaPagamentoId } });
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a forma de pagamento from an empresa', async () => {
      const empresaId = 1;
      const formaPagamentoId = 1;

      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await service.remove(empresaId, formaPagamentoId);

      expect(repository.delete).toHaveBeenCalledWith({ empresaId, formaPagamentoId });
    });
  });
});
