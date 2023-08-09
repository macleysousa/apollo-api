import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { faturaFakeRepository } from 'src/base-fake/fatura';
import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoInclusao } from 'src/commons/enum/tipo-inclusao';
import { ContextService } from 'src/context/context.service';

import { CreateFaturaManualDto } from './dto/create-fatura-manual.dto';
import { UpdateFaturaManualDto } from './dto/update-fatura-manual.dto';
import { FaturaEntity } from './entities/fatura.entity';
import { FaturaSituacao } from './enum/fatura-situacao.enum';
import { FaturaService } from './fatura.service';
import { FaturaParcelaService } from './parcela/parcela.service';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(faturaFakeRepository.findPaginate()),
}));
describe('FaturaService', () => {
  let service: FaturaService;
  let repository: Repository<FaturaEntity>;
  let parcelaService: FaturaParcelaService;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaturaService,
        {
          provide: getRepositoryToken(FaturaEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(faturaFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
            }),
          },
        },
        {
          provide: FaturaParcelaService,
          useValue: {
            import: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-16') }),
          },
        },
      ],
    }).compile();

    service = module.get<FaturaService>(FaturaService);
    repository = module.get<Repository<FaturaEntity>>(getRepositoryToken(FaturaEntity));
    parcelaService = module.get<FaturaParcelaService>(FaturaParcelaService);
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(parcelaService).toBeDefined();
    expect(contextService).toBeDefined();
  });

  describe('create', () => {
    it('should create a manual fatura', async () => {
      const usuario = contextService.currentUser();
      const empresa = contextService.currentBranch();
      const createFaturaDto: CreateFaturaManualDto = {
        pessoaId: 1,
        valor: 100,
        parcelas: 1,
        observacao: 'Observação',
      };
      const faturaResult = { ...faturaFakeRepository.findOne(), tipoInclusao: TipoInclusao.Manual };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(faturaResult);

      const result = await service.createManual(createFaturaDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createFaturaDto,
        empresaId: empresa.id,
        data: expect.any(Date),
        operadorId: usuario.id,
        tipoDocumento: TipoDocumento.Fatura,
        situacao: FaturaSituacao.Normal,
        tipoInclusao: TipoInclusao.Manual,
      });
      expect(result).toEqual(faturaResult);
    });

    it('should create a automatica fatura with itens', async () => {
      const usuario = contextService.currentUser();
      const empresa = contextService.currentBranch();
      const createFaturaDto: CreateFaturaManualDto = {
        pessoaId: 1,
        valor: 100,
        parcelas: 1,
        observacao: 'Observação',
        itens: [{ parcela: 1 }] as any,
      };
      const faturaResult = { ...faturaFakeRepository.findOne(), tipoInclusao: TipoInclusao.Automatica };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(faturaResult);

      const result = await service.createAutomatica(createFaturaDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createFaturaDto,
        empresaId: empresa.id,
        data: expect.any(Date),
        operadorId: usuario.id,
        situacao: FaturaSituacao.Normal,
        tipoInclusao: TipoInclusao.Automatica,
      });
      expect(parcelaService.import).toHaveBeenCalledTimes(1);
      expect(result).toEqual(faturaResult);
    });

    it('should create a automatica fatura without itens', async () => {
      const usuario = contextService.currentUser();
      const empresa = contextService.currentBranch();
      const createFaturaDto: CreateFaturaManualDto = {
        pessoaId: 1,
        valor: 100,
        parcelas: 1,
        observacao: 'Observação',
        itens: [] as any,
      };
      const faturaResult = { ...faturaFakeRepository.findOne(), tipoInclusao: TipoInclusao.Automatica };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(faturaResult);

      const result = await service.createAutomatica(createFaturaDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createFaturaDto,
        empresaId: empresa.id,
        data: expect.any(Date),
        operadorId: usuario.id,
        situacao: FaturaSituacao.Normal,
        tipoInclusao: TipoInclusao.Automatica,
      });
      expect(parcelaService.import).toHaveBeenCalledTimes(0);
      expect(result).toEqual(faturaResult);
    });
  });

  describe('find', () => {
    it('should find faturas with filters', async () => {
      const filter = {
        empresaIds: [1],
        faturaIds: [1],
        pessoaIds: [1],
        dataInicio: new Date(),
        dataFim: new Date(),
      };

      const result = await service.find(filter, 1, 100, ['itens']);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('f');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('f.pessoa', 'p');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('f.itens', 'i');
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ pessoaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: filter.dataFim });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: filter.dataFim });

      expect(result).toEqual(faturaFakeRepository.findPaginate());
    });

    it('should find faturas filters empty', async () => {
      const filter = {
        empresaIds: [],
        faturaIds: [],
        pessoaIds: [],
        dataInicio: null,
        dataFim: null,
      };

      const result = await service.find(filter, 1, 100);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('f');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('f.pessoa', 'p');
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ pessoaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: filter.dataFim });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: filter.dataFim });

      expect(result).toEqual(faturaFakeRepository.findPaginate());
    });

    it('should find faturas without filters', async () => {
      const filter = undefined;
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('f');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('f.pessoa', 'p');
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ id: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ pessoaId: expect.any(Object) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: expect.any(Date) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('f.data <= :dataFim', { dataFim: expect.any(Date) });

      expect(result).toEqual(faturaFakeRepository.findPaginate());
    });
  });

  describe('findById', () => {
    it('should find a fatura by id', async () => {
      const empresaId = 1;
      const id = 1;

      const result = await service.findById(empresaId, id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, id } });
      expect(result).toEqual(faturaFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a fatura', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const updateFaturaDto: UpdateFaturaManualDto = { valor: 100 };
      const fatura = new FaturaEntity({ id: 1, empresaId: 1, valor: 100, situacao: FaturaSituacao.Normal });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(fatura);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(fatura);

      const result = await service.update(empresaId, id, updateFaturaDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, id } });
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id, operadorId }, updateFaturaDto);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(fatura);
    });

    it('should throw BadRequestException if fatura is not found', async () => {
      const empresaId = 1;
      const id = 1;
      const updateFaturaDto: UpdateFaturaManualDto = { valor: 100 };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.update(empresaId, id, updateFaturaDto)).rejects.toThrowError('Fatura não encontrada');
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });

    it('should throw BadRequestException if fatura is not in Normal situation', async () => {
      const empresaId = 1;
      const id = 1;
      const updateFaturaDto: UpdateFaturaManualDto = { valor: 100 };
      const fatura = new FaturaEntity({ id: 1, empresaId: 1, valor: 100, situacao: FaturaSituacao.Cancelada });

      jest.spyOn(service, 'findById').mockResolvedValueOnce(fatura);

      await expect(service.update(empresaId, id, updateFaturaDto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });

    it('should throw BadRequestException if update fails', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const updateFaturaDto: UpdateFaturaManualDto = { valor: 100 };
      const fatura = new FaturaEntity({ id: 1, empresaId: 1, valor: 100, situacao: FaturaSituacao.Normal });

      jest.spyOn(service, 'findById').mockResolvedValueOnce(fatura);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.update(empresaId, id, updateFaturaDto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id, operadorId }, updateFaturaDto);
    });
  });

  describe('cancelar', () => {
    it('should cancel a fatura', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const fatura = new FaturaEntity({ id: 1, empresaId: 1, valor: 100, situacao: FaturaSituacao.Normal });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(fatura);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(fatura);

      const result = await service.cancelar(empresaId, id);

      expect(result).toEqual(fatura);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, id } });
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id, operadorId }, { situacao: FaturaSituacao.Cancelada });
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });

    it('should throw BadRequestException if fatura is not found', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.cancelar(empresaId, id)).rejects.toThrowError('Fatura não encontrada');
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).not.toHaveBeenCalledWith({ empresaId, id, operadorId }, { situacao: FaturaSituacao.Cancelada });
    });

    it('should throw BadRequestException if update fails', async () => {
      const empresaId = 1;
      const id = 1;
      const operadorId = 1;
      const fatura = new FaturaEntity({ id: 1, empresaId: 1, valor: 100, situacao: FaturaSituacao.Normal });

      jest.spyOn(service, 'findById').mockResolvedValueOnce(fatura);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(undefined);

      await expect(service.cancelar(empresaId, id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id, operadorId }, { situacao: FaturaSituacao.Cancelada });
    });
  });
});
