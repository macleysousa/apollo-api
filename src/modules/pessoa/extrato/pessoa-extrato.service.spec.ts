import { Test, TestingModule } from '@nestjs/testing';
import { PessoaExtratoService } from './pessoa-extrato.service';
import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoDocumento } from './enum/tipo-documento.enum';
import { TipoHistorico } from 'src/modules/caixa/extrato/enum/tipo-historico.enum';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';

describe('PessoaExtratoService', () => {
  let service: PessoaExtratoService;
  let repository: Repository<PessoaExtratoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaExtratoService,
        {
          provide: getRepositoryToken(PessoaExtratoEntity),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PessoaExtratoService>(PessoaExtratoService);
    repository = module.get<Repository<PessoaExtratoEntity>>(getRepositoryToken(PessoaExtratoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('lancarMovimento', () => {
    it('should return a PessoaExtratoEntity', async () => {
      const pessoaId = 1;
      const dto = {
        tipoDocumento: TipoDocumento.Adiantamento,
        tipoHistorico: TipoHistorico.Adiantamento,
        tipoMovimento: TipoMovimento.Credito,
        valor: 100,
        observacao: 'Teste',
      };

      const pessoa: PessoaExtratoEntity = new PessoaExtratoEntity({
        liquidacao: 1,
        empresaId: 1,
        pessoaId: 1,
        tipoDocumento: TipoDocumento.Adiantamento,
        valor: 100,
        data: new Date(),
      });

      jest.spyOn(repository, 'save').mockResolvedValueOnce(pessoa);

      const result = await service.lancarMovimento(pessoaId, dto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(pessoa);
    });
  });

  describe('find', () => {
    it('should return an array of PessoaExtratoEntity', async () => {
      const filter = {
        empresaIds: [1],
        pessoaId: 1,
        dataInicio: new Date(),
        dataFim: new Date(),
        tipoDocumento: [TipoDocumento.Adiantamento],
      } as any;

      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Adiantamento,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(result),
      } as any);

      const response = await service.find(filter);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ empresaId: In(filter.empresaIds) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ pessoaId: filter.pessoaId });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('p.data >= :dataInicio', { dataInicio: expect.any(Date) });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('p.data <= :dataFim', { dataFim: expect.any(Date) });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(response).toBe(result);
    });

    it('should return an array of PessoaExtratoEntity outwith filter', async () => {
      const filter = undefined;

      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Adiantamento,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(result),
      } as any);

      const response = await service.find(filter);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: expect.anything() });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ pessoaId: expect.anything() });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('p.data >= :dataInicio', { dataInicio: expect.any(Date) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('p.data <= :dataFim', { dataFim: expect.any(Date) });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(response).toBe(result);
    });

    it('should return an array of PessoaExtratoEntity with empty filter', async () => {
      const filter = {} as any;

      const result: PessoaExtratoEntity[] = [
        new PessoaExtratoEntity({
          liquidacao: 1,
          empresaId: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Adiantamento,
          valor: 100,
          data: new Date(),
        }),
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(result),
      } as any);

      const response = await service.find(filter);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ empresaId: Not(IsNull()) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: expect.anything() });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ pessoaId: expect.anything() });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('p.data >= :dataInicio', { dataInicio: expect.any(Date) });
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('p.data <= :dataFim', { dataFim: expect.any(Date) });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(response).toBe(result);
    });
  });

  describe('findSaldoAdiantamento', () => {
    it('should return "Adiantamento" value', async () => {
      const pessoaId = 1;
      const empresaId = 1;
      const result = 100;

      jest.spyOn(repository, 'find').mockResolvedValueOnce([{ valor: 100 }] as any);

      const response = await service.findSaldoAdiantamento(pessoaId, empresaId);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { empresaId, pessoaId, tipoDocumento: TipoDocumento.Adiantamento, cancelado: false },
      });

      expect(response).toBe(result);
    });
  });

  describe('findSaldoCreditoDeDevolucao', () => {
    it('should return "Credito de Devolucao" value', async () => {
      const pessoaId = 1;
      const empresaId = 1;
      const result = 100;

      jest.spyOn(repository, 'find').mockResolvedValueOnce([{ valor: 100 }] as any);

      const response = await service.findSaldoCreditoDeDevolucao(pessoaId, empresaId);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { empresaId, pessoaId, tipoDocumento: TipoDocumento.Credito_de_Devolucao, cancelado: false },
      });

      expect(response).toBe(result);
    });
  });
});
