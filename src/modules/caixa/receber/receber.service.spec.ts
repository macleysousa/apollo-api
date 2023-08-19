import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';
import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

import { CaixaExtratoService } from '../extrato/extrato.service';
import { PagamentoDto } from './dto/pagamento.dto';
import { RecebimentoDto } from './dto/recebimento.dto';
import { ReceberService } from './receber.service';
import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoEntity } from '../extrato/entities/extrato.entity';
import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';

describe('ReceberService', () => {
  let service: ReceberService;
  let formaDePagamentoService: FormaDePagamentoService;
  let pessoaExtratoService: PessoaExtratoService;
  let faturaService: FaturaService;
  let caixaExtratoService: CaixaExtratoService;
  let romaneioService: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceberService,
        {
          provide: ContextService,
          useValue: {
            empresaId: jest.fn().mockReturnValue(1),
          },
        },
        {
          provide: FormaDePagamentoService,
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: PessoaExtratoService,
          useValue: {
            findSaldoAdiantamento: jest.fn(),
            findSaldoCreditoDeDevolucao: jest.fn(),
          },
        },
        {
          provide: FaturaService,
          useValue: {
            createAutomatica: jest.fn(),
          },
        },
        {
          provide: CaixaExtratoService,
          useValue: {
            create: jest.fn(),
            newLiquidacaoId: jest.fn(),
            lancarLiquidacao: jest.fn(),
          },
        },
        {
          provide: RomaneioService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReceberService>(ReceberService);
    formaDePagamentoService = module.get<FormaDePagamentoService>(FormaDePagamentoService);
    pessoaExtratoService = module.get<PessoaExtratoService>(PessoaExtratoService);
    faturaService = module.get<FaturaService>(FaturaService);
    caixaExtratoService = module.get<CaixaExtratoService>(CaixaExtratoService);
    romaneioService = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(formaDePagamentoService).toBeDefined();
    expect(pessoaExtratoService).toBeDefined();
    expect(faturaService).toBeDefined();
    expect(caixaExtratoService).toBeDefined();
    expect(romaneioService).toBeDefined();
  });

  describe('adiantamento', () => {
    it('should create a new adiantamento with the provided data', async () => {
      const caixaId = 1;
      const formasDePagamento = [{ formaDePagamentoId: 1, valor: 50 }] as any;
      const recebimento = { pessoaId: 1, valor: 50 } as any;
      const dto: ReceberAdiantamentoDto = { ...recebimento, formasDePagamento } as any;
      const empresaId = 1;
      const faturas: FaturaEntity[] = [{ id: 1 }] as any;
      const extrato: CaixaExtratoEntity[] = [{ id: 1 }] as any;

      const mockLancarFaturas = jest.spyOn(service, 'lancarFaturas').mockResolvedValueOnce(faturas);
      const mockLancarLiquidacao = jest.spyOn(service, 'lancarLiquidacao').mockResolvedValueOnce(extrato);

      const result = await service.adiantamento(caixaId, dto);

      expect(mockLancarFaturas).toHaveBeenCalledTimes(1);
      expect(mockLancarFaturas).toHaveBeenCalledWith(empresaId, recebimento, formasDePagamento);
      expect(mockLancarLiquidacao).toHaveBeenCalledTimes(1);
      expect(mockLancarLiquidacao).toHaveBeenCalledWith(caixaId, TipoHistorico.Adiantamento, faturas);
      expect(result).toEqual(extrato);
    });
  });

  describe('lancarLiquidacao', () => {
    it('should create a new liquidation with the provided data', async () => {
      const caixaId = 2;
      const extrato: CaixaExtratoEntity[] = [
        {
          caixaId: 2,
          data: new Date('2023-09-23T03:00:00.000Z'),
          tipoDocumento: TipoDocumento.Dinheiro,
          tipoMovimento: TipoMovimento.Credito,
          valor: 50,
        },
      ] as any;

      const faturas: FaturaEntity[] = [
        {
          id: 1,
          pessoaId: 1,
          tipoDocumento: TipoDocumento.Dinheiro,
          tipoMovimento: TipoMovimento.Credito,
          valor: 50,
          itens: [{ faturaId: 1, parcela: 1, valor: 100 }],
        },
      ] as any;

      jest.spyOn(caixaExtratoService, 'newLiquidacaoId').mockResolvedValueOnce(1692454275429);
      jest.spyOn(caixaExtratoService, 'lancarLiquidacao').mockResolvedValueOnce(extrato);

      const result = await service.lancarLiquidacao(caixaId, TipoHistorico.Adiantamento, faturas);

      expect(caixaExtratoService.newLiquidacaoId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(extrato);
    });
  });

  describe('lancarFaturas', () => {
    it('should throw an error if the total payment is less than the total value of the receipts', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [{ controle: 1, formaDePagamentoId: 3, valor: 50, parcela: 1 }];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
      ] as any);

      await expect(service.lancarFaturas(empresaId, recebimento, formasDePagamento)).rejects.toThrow(
        new BadRequestException('Valor insuficiente para realizar o a operação.')
      );
    });

    it('should throw an error if the total payment is greater than the total value of the receipts and there is not enough cash to give change', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [{ controle: 1, formaDePagamentoId: 1, valor: 150, parcela: 1 }];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
      ] as any);

      await expect(service.lancarFaturas(empresaId, recebimento, formasDePagamento)).rejects.toThrow(
        new BadRequestException('Valor em dinheiro insuficiente para realizar o a operação com troco.')
      );
    });

    it('should throw an error if the adiantamento balance is insufficient', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [{ controle: 1, formaDePagamentoId: 1, valor: 100, parcela: 1 }];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
      ] as any);

      jest.spyOn(pessoaExtratoService, 'findSaldoAdiantamento').mockResolvedValueOnce(0);

      await expect(service.lancarFaturas(empresaId, recebimento, formasDePagamento)).rejects.toThrow(
        new BadRequestException('Saldo de adiantamento insuficiente para realizar o a operação.')
      );
    });

    it('should throw an error if the credit balance is insufficient', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [{ controle: 1, formaDePagamentoId: 2, valor: 100, parcela: 1 }];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
      ] as any);

      jest.spyOn(pessoaExtratoService, 'findSaldoCreditoDeDevolucao').mockResolvedValueOnce(0);

      await expect(service.lancarFaturas(empresaId, recebimento, formasDePagamento)).rejects.toThrow(
        new BadRequestException('Creditos de devolução insuficiente para realizar o a operação.')
      );
    });

    it('should create a change receipt if the total payment is greater than the total value of the receipts and there is enough cash to give change', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [{ controle: 1, formaDePagamentoId: 3, valor: 150, parcela: 1 }];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
      ] as any);

      const faturaDinheiro: FaturaEntity = {
        id: 1,
        pessoaId: 1,
        formaDePagamentoId: 1,
        tipoDocumento: TipoDocumento.Dinheiro,
        tipoMovimento: TipoMovimento.Credito,
        valor: 100,
        observacao: '',
        itens: [{ parcela: 1, valor: 100 }],
      } as any;

      const faturaTroco: FaturaEntity = {
        id: 2,
        pessoaId: 1,
        formaDePagamentoId: 1,
        tipoDocumento: TipoDocumento.Troco,
        tipoMovimento: TipoMovimento.Debito,
        valor: 50,
        observacao: '',
        itens: [{ parcela: 1, valor: 50 }],
      } as any;

      jest.spyOn(faturaService, 'createAutomatica').mockResolvedValueOnce(faturaDinheiro).mockResolvedValueOnce(faturaTroco);

      const result = await service.lancarFaturas(empresaId, recebimento, formasDePagamento);

      expect(result).toEqual([faturaDinheiro, faturaTroco]);
    });

    it('should create a receipt for each payment', async () => {
      const empresaId = 1;
      const recebimento: RecebimentoDto = { pessoaId: 1, valor: 100 };
      const formasDePagamento: PagamentoDto[] = [
        { controle: 1, formaDePagamentoId: 3, valor: 50, parcela: 1 },
        { controle: 2, formaDePagamentoId: 4, valor: 50, parcela: 1 },
      ];

      jest.spyOn(formaDePagamentoService, 'find').mockResolvedValueOnce([
        { id: 1, tipo: TipoDocumento.Adiantamento },
        { id: 2, tipo: TipoDocumento.Credito_de_devolucao },
        { id: 3, tipo: TipoDocumento.Dinheiro },
        { id: 4, tipo: TipoDocumento.Cartao },
      ] as any);

      const faturaDinheiro: FaturaEntity = {
        id: 1,
        pessoaId: 1,
        tipoDocumento: TipoDocumento.Dinheiro,
        tipoMovimento: TipoMovimento.Credito,
        valor: 50,
        observacao: '',
        itens: [{ parcela: 1, valor: 50 }],
      } as any;

      const faturaCartão: FaturaEntity = {
        id: 2,
        pessoaId: 1,
        tipoDocumento: TipoDocumento.Cartao,
        tipoMovimento: TipoMovimento.Credito,
        valor: 50,
        observacao: '',
        itens: [{ parcela: 1, valor: 50 }],
      } as any;

      jest.spyOn(faturaService, 'createAutomatica').mockResolvedValueOnce(faturaDinheiro).mockResolvedValueOnce(faturaCartão);

      const result = await service.lancarFaturas(empresaId, recebimento, formasDePagamento);

      expect(faturaService.createAutomatica).toHaveReturnedTimes(2);
      expect(result).toEqual([faturaDinheiro, faturaCartão]);
    });
  });
});
