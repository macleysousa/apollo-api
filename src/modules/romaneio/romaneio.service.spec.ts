import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { romaneioFakeRepository } from 'src/base-fake/romaneio';
import { ContextService } from 'src/context/context.service';

import { EmpresaParametroService } from '../empresa/parametro/parametro.service';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { ModalidadeRomaneio } from './enum/modalidade-romaneio.enum';
import { OperacaoRomaneio, OperacaoRomaneioType } from './enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { RomaneioService } from './romaneio.service';
import { RomaneioView } from './views/romaneio.view';
import { RomaneioFilter } from './filters/romaneio.filter';

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
              leftJoinAndSelect: jest.fn().mockReturnThis(),
            }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ id: 1 }),
            operadorId: jest.fn().mockReturnValue(1),
            empresa: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-05') }),
            data: jest.fn().mockReturnValue('2023-06-05'),
            parametros: jest.fn().mockReturnValue([{ parametroId: 'QT_DIAS_DEVOLUCAO', valor: 60 }]),
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

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.EmAndamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
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

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
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
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
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

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
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
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
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

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
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
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
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

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
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
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });
  });

  describe('find', () => {
    it('should find romaneios with filter', async () => {
      const filter: RomaneioFilter = {
        dataInicial: new Date(),
        dataFinal: new Date(),
        empresaIds: [1],
        pessoaIds: [1],
        funcionarioIds: [1],
        modalidades: ['Entrada'],
        operacoes: ['Compra'],
        situacoes: ['Encerrado'],
        incluir: ['itens'],
      };
      const page = 1;
      const limit = 100;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data >= :dataInicial', { dataInicial: filter.dataInicial });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data <= :dataFinal', { dataFinal: filter.dataFinal });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.pessoaId IN (:...pessoaIds)', { pessoaIds: filter.pessoaIds });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.funcionarioId IN (:...funcionarioIds)', {
        funcionarioIds: filter.funcionarioIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.modalidade IN (:...modalidades)', {
        modalidades: filter.modalidades,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.operacao IN (:...operacoes)', { operacoes: filter.operacoes });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.situacao IN (:...situacoes)', { situacoes: filter.situacoes });

      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });

    it('should find romaneios filter empty', async () => {
      const filter = { empresaIds: [], funcionarioIds: [], dataInicial: undefined, dataFinal: undefined };
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
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
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });
  });

  describe('findById', () => {
    it('should find a romaneio by id', async () => {
      const empresaId = 1;
      const id = 1;
      const relations = ['itens'] as any;

      const result = await service.findById(empresaId, id, relations);

      expect(view.find).toHaveBeenCalledWith({ where: { empresaId: empresaId, romaneioId: id }, relations });
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });
  });

  describe('findByIds', () => {
    it('should find romaneios by ids', async () => {
      const empresaId = 1;
      const ids = [1, 2, 3];
      const relations = ['itens'] as any;

      const result = await service.findByIds(empresaId, ids, relations);

      expect(view.find).toHaveBeenCalledWith({ where: { empresaId: empresaId, romaneioId: In(ids) }, relations });
      expect(result).toEqual(romaneioFakeRepository.findView());
    });
  });

  describe('observacao', () => {
    it('should update observacao', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: 'Teste' };

      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());

      const result = await service.observacao(empresaId, id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, { observacao: dto.observacao });
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should not update observacao romaneio not Em andamento', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: undefined };
      const romaneio = { ...romaneioFakeRepository.findOneView(), situacao: SituacaoRomaneio.Cancelado };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.observacao(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if update observacao', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: 'Teste' };
      const romaneio = { id: 1, situacao: SituacaoRomaneio.EmAndamento, operacao: OperacaoRomaneio.Outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.observacao(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ id }, { observacao: dto.observacao });
    });
  });

  describe('validarDevolucao', () => {
    it('should return BadRequestException if romaneios invalid operacao', () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'Venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [{ ...romaneioFakeRepository.findOneView(), operacao: OperacaoRomaneio.Outros }] as any;
      const romaneio = { ...romaneioFakeRepository.findOneView(), operacao: OperacaoRomaneio.Devolucao_Venda };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.validarDevolucao(empresaId, id, operacao, romaneiosDevolucao)).rejects.toThrow(BadRequestException);
      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
    });

    it('should return true if romaneios are valid', async () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'Venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [
        {
          ...romaneioFakeRepository.findOneView(),
          operacao: OperacaoRomaneio.Venda,
          itens: romaneioFakeRepository.findViewItens(),
        },
      ];
      const romaneio = {
        ...romaneioFakeRepository.findOneView(),
        operacao: OperacaoRomaneio.Devolucao_Venda,
        itens: romaneioFakeRepository.findViewItens(),
      };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      const result = await service.validarDevolucao(empresaId, id, operacao, romaneiosDevolucao);

      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
      expect(result).toEqual(true);
    });

    it('should return false if romaneios are invalid', async () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'Venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [
        {
          ...romaneioFakeRepository.findOneView(),
          operacao: OperacaoRomaneio.Venda,
          itens: [{ ...romaneioFakeRepository.findOneViewItem(), devolvido: 100, quantidade: 100 }],
        },
      ];
      const romaneio = {
        ...romaneioFakeRepository.findOneView(),
        operacao: OperacaoRomaneio.Devolucao_Venda,
        itens: [{ ...romaneioFakeRepository.findOneViewItem(), quantidade: 1 }],
      };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      const result = await service.validarDevolucao(empresaId, id, operacao, romaneiosDevolucao);

      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
      expect(result).toEqual(false);
    });
  });

  describe('encerrar', () => {
    it('should throw BadRequestException if romaneio is not in EmAndamento state', async () => {
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const romaneio = { situacao: SituacaoRomaneio.Encerrado } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      await expect(service.encerrar(empresaId, caixaId, id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });

    it('should update romaneio situacao to Encerrado if operacao is Outros', async () => {
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.EmAndamento, operacao: OperacaoRomaneio.Outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ id }, { caixaId, situacao: SituacaoRomaneio.Encerrado });
    });

    it('should update romaneio situacao to Encerrado if operacao is venda', async () => {
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = 1692703474445;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.EmAndamento, operacao: OperacaoRomaneio.Venda } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id, liquidacao);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ id }, { caixaId, situacao: SituacaoRomaneio.Encerrado, liquidacao });
    });

    it('should throw BadRequestException if update situacao', async () => {
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.EmAndamento, operacao: OperacaoRomaneio.Outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.encerrar(empresaId, caixaId, id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ id }, { caixaId, situacao: SituacaoRomaneio.Encerrado });
    });
  });

  describe('cancelar', () => {
    it('should cancel a romaneio', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(empresaId, id, motivo);

      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.Cancelado, motivoCancelamento: motivo, operadorId }
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should throw BadRequestException if cancelar fails', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';

      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.cancelar(empresaId, id, motivo)).rejects.toThrow(BadRequestException);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.Cancelado, motivoCancelamento: motivo, operadorId }
      );
    });
  });
});
