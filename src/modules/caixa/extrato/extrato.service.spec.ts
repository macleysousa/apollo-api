import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { ContextService } from 'src/context/context.service';

import { LancarMovimento } from './dto/lancar-movimento.dto';
import { CaixaExtratoEntity } from './entities/extrato.entity';
import { TipoHistorico } from './enum/tipo-historico.enum';
import { CaixaExtratoService } from './extrato.service';

describe('CaixaExtratoService', () => {
  let service: CaixaExtratoService;
  let repository: Repository<CaixaExtratoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaExtratoService,
        {
          provide: getRepositoryToken(CaixaExtratoEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              getRawOne: jest.fn(),
            })),
            insert: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ id: 1 }),
            empresa: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-08-16') }),
            operadorId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<CaixaExtratoService>(CaixaExtratoService);
    repository = module.get<Repository<CaixaExtratoEntity>>(getRepositoryToken(CaixaExtratoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of CaixaExtratoEntity', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const expectedResult = [new CaixaExtratoEntity()];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.find(empresaId, caixaId);

      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, caixaId } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByDocumento', () => {
    it('should return a CaixaExtratoEntity', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const documento = 3;
      const expectedResult = new CaixaExtratoEntity();

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedResult);

      const result = await service.findByDocumento(empresaId, caixaId, documento);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, caixaId, documento } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByLiquidacao', () => {
    it('should return an array of CaixaExtratoEntity', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const liquidacao = 3;
      const expectedResult = [new CaixaExtratoEntity()];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findByLiquidacao(empresaId, caixaId, liquidacao);

      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, caixaId, liquidacao } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('newLiquidacaoId', () => {
    it('should return a number', async () => {
      const timestamp = 1692187175889;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ timestamp }),
      } as any);

      const result = await service.newLiquidacaoId();

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().select).toHaveBeenCalledWith(`FLOOR(UNIX_TIMESTAMP(NOW(3)) * 1000) AS timestamp`);
      expect(result).toEqual(timestamp);
    });
  });

  describe('lancarLiquidacao', () => {
    it('should return a CaixaExtratoEntity', async () => {
      const operadorId = 1;
      const empresa = { id: 1, data: new Date('2023-08-16') };
      const caixaId = 2;
      const liquidacao = 4;
      const expectedResult = [new CaixaExtratoEntity({ liquidacao })];
      const dto = [
        new LancarMovimento({
          tipoDocumento: TipoDocumento.Cartao,
          tipoHistorico: TipoHistorico.Venda,
          tipoMovimento: TipoMovimento.Credito,
          valor: 10,
        }),
      ];

      jest.spyOn(repository, 'insert').mockResolvedValue(undefined);
      jest.spyOn(service, 'findByLiquidacao').mockResolvedValue(expectedResult);

      const result = await service.lancar(caixaId, liquidacao, dto);

      expect(repository.insert).toHaveBeenCalledWith(
        dto.map((item) => ({
          ...item,
          empresaId: empresa.id,
          data: empresa.data,
          caixaId: caixaId,
          liquidacao: liquidacao,
          operadorId: operadorId,
        })),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancelarLiquidacao', () => {
    it('should throw an error if the liquidation is for opening a cash register', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const liquidacao = 3;
      const motivoCancelamento = 'Motivo de cancelamento';
      const error = new BadRequestException(`Não é possível cancelar liquidação de abertura de caixa`);

      jest.spyOn(service, 'findByLiquidacao').mockResolvedValueOnce([{ tipoHistorico: TipoHistorico.Abertura_de_caixa }] as any);

      await expect(service.cancelar(empresaId, caixaId, liquidacao, motivoCancelamento)).rejects.toThrow(error);
    });

    it('should throw an error if the liquidation is for closing a cash register', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const liquidacao = 3;
      const motivoCancelamento = 'Motivo de cancelamento';
      const error = new BadRequestException(`Não é possível cancelar liquidação de fechamento de caixa`);

      jest
        .spyOn(service, 'findByLiquidacao')
        .mockResolvedValueOnce([{ tipoHistorico: TipoHistorico.Fechamento_de_caixa }] as any);

      await expect(service.cancelar(empresaId, caixaId, liquidacao, motivoCancelamento)).rejects.toThrow(error);
    });

    it('should throw an error if the liquidation has already been canceled', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const liquidacao = 3;
      const motivoCancelamento = 'Motivo de cancelamento';
      const error = new BadRequestException(`A liquidação ${liquidacao} já foi cancelada`);

      jest.spyOn(service, 'findByLiquidacao').mockResolvedValueOnce([{ cancelado: true }] as any);

      await expect(service.cancelar(empresaId, caixaId, liquidacao, motivoCancelamento)).rejects.toThrow(error);
    });

    it('should update the liquidation with the provided data', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const liquidacao = 3;
      const motivoCancelamento = 'Motivo de cancelamento';

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      jest
        .spyOn(service, 'findByLiquidacao')
        .mockResolvedValueOnce([{ tipoHistorico: TipoHistorico.Venda, cancelado: false }] as any);

      await service.cancelar(empresaId, caixaId, liquidacao, motivoCancelamento);

      expect(repository.update).toHaveBeenCalledWith(
        { empresaId, caixaId, liquidacao },
        { operadorId: expect.any(Number), motivoCancelamento, cancelado: true },
      );
    });
  });
});
