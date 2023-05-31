import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateFormaDePagamentoDto } from './dto/create-forma-de-pagamento.dto';
import { UpdateFormaDePagamentoDto } from './dto/update-forma-de-pagamento.dto';
import { FormaDePagamentoEntity } from './entities/forma-de-pagamento.entity';
import { PagamentoTipo } from './enum/pagamento-tipo.enum';
import { FormaDePagamentoService } from './forma-de-pagamento.service';

describe('FormaDePagamentoService', () => {
  let service: FormaDePagamentoService;
  let repository: Repository<FormaDePagamentoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormaDePagamentoService,
        {
          provide: getRepositoryToken(FormaDePagamentoEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FormaDePagamentoService>(FormaDePagamentoService);
    repository = module.get<Repository<FormaDePagamentoEntity>>(getRepositoryToken(FormaDePagamentoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    it('should add a new forma de pagamento', async () => {
      const createFormaDePagamentoDto: CreateFormaDePagamentoDto = { descricao: 'Teste', tipo: PagamentoTipo.Dinheiro };
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = 1;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(repository, 'save').mockResolvedValueOnce(formaDePagamento);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(formaDePagamento);

      const result = await service.add(createFormaDePagamentoDto);

      expect(repository.save).toHaveBeenCalledWith(createFormaDePagamentoDto);
      expect(service.findById).toHaveBeenCalledWith(formaDePagamento.id);
      expect(result).toBe(formaDePagamento);
    });
  });

  describe('find', () => {
    it('should find formas de pagamento with filter', async () => {
      const filter = 'Teste';
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = 1;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(repository, 'find').mockResolvedValueOnce([formaDePagamento]);

      const result = await service.find(filter);

      expect(repository.find).toHaveBeenCalledWith({ where: { descricao: ILike(`%${filter ?? ''}%`) } });
      expect(result).toEqual([formaDePagamento]);
    });

    it('should find formas de pagamento without filter', async () => {
      const filter = undefined;
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = 1;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(repository, 'find').mockResolvedValueOnce([formaDePagamento]);

      const result = await service.find(filter);

      expect(repository.find).toHaveBeenCalledWith({ where: { descricao: ILike(`%${filter ?? ''}%`) } });
      expect(result).toEqual([formaDePagamento]);
    });
  });

  describe('findById', () => {
    it('should find a forma de pagamento by id', async () => {
      const id = 1;
      const formaDePagamento = new FormaDePagamentoEntity();
      formaDePagamento.id = id;
      formaDePagamento.descricao = 'Teste';

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(formaDePagamento);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
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

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(formaDePagamento);

      const result = await service.update(id, updateFormaDePagamentoDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateFormaDePagamentoDto);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(formaDePagamento);
    });
  });
});
