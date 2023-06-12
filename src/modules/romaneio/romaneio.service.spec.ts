import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { romaneioFakeRepository } from 'src/base-fake/romaneio';

import { RomaneioEntity } from './entities/romaneio.entity';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { RomaneioService } from './romaneio.service';
import { RomaneioView } from './views/romaneio.view';
import { EmpresaParametroService } from '../empresa/parametro/parametro.service';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { BadRequestException } from '@nestjs/common';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { ModalidadeRomaneio } from './enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from './enum/operacao-romaneio.enum';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(romaneioFakeRepository.findViewPaginate()),
}));
describe('RomaneioService', () => {
  let service: RomaneioService;
  let repository: Repository<RomaneioEntity>;
  let view: Repository<RomaneioView>;
  let contextService: ContextService;
  let empresaParamService: EmpresaParametroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioService,
        {
          provide: getRepositoryToken(RomaneioEntity),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RomaneioView),
          useValue: {
            find: jest.fn().mockResolvedValue(romaneioFakeRepository.findView()),
            findOne: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
            }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-05') }),
          },
        },
        {
          provide: EmpresaParametroService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RomaneioService>(RomaneioService);
    repository = module.get<Repository<RomaneioEntity>>(getRepositoryToken(RomaneioEntity));
    view = module.get<Repository<RomaneioView>>(getRepositoryToken(RomaneioView));
    contextService = module.get<ContextService>(ContextService);
    empresaParamService = module.get<EmpresaParametroService>(EmpresaParametroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
    expect(contextService).toBeDefined();
    expect(empresaParamService).toBeDefined();
  });

  describe('create', () => {
    it('should create a romaneio', async () => {
      const createRomaneioDto = { descricao: 'Teste' } as any;
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should create a romaneio Compra', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        modalidade: ModalidadeRomaneio.Entrada,
        operacao: OperacaoRomaneio.Compra,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(empresaParamService, 'find').mockResolvedValueOnce([{ parametroId: 'OBS_PADRAO_COMPRA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should create a romaneio Compra not found', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        modalidade: ModalidadeRomaneio.Entrada,
        operacao: OperacaoRomaneio.Compra,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(empresaParamService, 'find').mockResolvedValueOnce([] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should create a romaneio Venda', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        modalidade: ModalidadeRomaneio.Saida,
        operacao: OperacaoRomaneio.Venda,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(empresaParamService, 'find').mockResolvedValueOnce([{ parametroId: 'OBS_PADRAO_VENDA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should create a romaneio Venda not found', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        modalidade: ModalidadeRomaneio.Saida,
        operacao: OperacaoRomaneio.Venda,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: 1 } as any);
      jest.spyOn(empresaParamService, 'find').mockResolvedValueOnce([{ parametroId: '', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('find', () => {
    it('should find romaneios with filter', async () => {
      const filter = { empresaIds: [1], funcionarioIds: [1], dataInicial: new Date(), dataFinal: new Date() };
      const page = 1;
      const limit = 100;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith({ empresaId: In(filter.empresaIds) });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith({ funcionarioId: In(filter.funcionarioIds) });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data >= :dataInicial', { dataInicial: filter.dataInicial });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data <= :dataFinal', { dataFinal: filter.dataFinal });

      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });

    it('should find romaneios filter empty', async () => {
      const filter = { empresaIds: [], funcionarioIds: [], dataInicial: undefined, dataFinal: undefined };
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: In(filter.empresaIds) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ funcionarioId: In(filter.funcionarioIds) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('e.data >= :dataInicial', { dataInicial: filter.dataInicial });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('e.data <= :dataFinal', { dataFinal: filter.dataFinal });

      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });

    it('should find romaneios without filter', async () => {
      const filter = undefined;
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });
  });

  describe('findById', () => {
    it('should find a romaneio by id', async () => {
      const id = 1;

      const result = await service.findById(id);

      expect(view.findOne).toHaveBeenCalledWith({ where: { romaneioId: id } });
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });
  });

  describe('observacao', () => {
    it('should update observacao', async () => {
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: 'Teste' };

      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());

      const result = await service.observacao(id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, { observacao: dto.observacao });
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should not update observacao romaneio not Em andamento', async () => {
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: undefined };
      const romaneio = { ...romaneioFakeRepository.findOneView(), situacao: SituacaoRomaneio.Cancelado };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.observacao(id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('cancelar', () => {
    it('should cancel a romaneio', async () => {
      const id = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(id);

      expect(repository.update).toHaveBeenCalledWith({ id }, { situacao: SituacaoRomaneio.Cancelado });
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should not cancel romaneio', async () => {
      const id = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce({ ...romaneioFakeRepository.findOneView(), data: new Date('2023-06-04') });

      expect(service.cancelar(id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
