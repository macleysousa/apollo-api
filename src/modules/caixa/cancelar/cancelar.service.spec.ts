import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioItemService } from 'src/modules/romaneio/romaneio-item/romaneio-item.service';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';

import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';
import { CancelarService } from './cancelar.service';
import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';
import { CancelarRomaneioDto } from './dto/cancelar-romaneio.dto';

describe('CancelarService', () => {
  let service: CancelarService;
  let contextService: ContextService;
  let caixaExtratoService: CaixaExtratoService;
  let pessoaExtratoService: PessoaExtratoService;
  let romaneioService: RomaneioService;
  let romaneioItemService: RomaneioItemService;
  let estoqueService: EstoqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelarService,
        {
          provide: ContextService,
          useValue: {
            empresaId: jest.fn().mockReturnValue(1),
            operadorId: jest.fn().mockReturnValue(1),
          },
        },
        {
          provide: CaixaExtratoService,
          useValue: {
            findByLiquidacao: jest.fn(),
            cancelarLiquidacao: jest.fn(),
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
          provide: RomaneioService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: RomaneioItemService,
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: EstoqueService,
          useValue: {
            findByProdutoIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CancelarService>(CancelarService);
    contextService = module.get<ContextService>(ContextService);
    caixaExtratoService = module.get<CaixaExtratoService>(CaixaExtratoService);
    pessoaExtratoService = module.get<PessoaExtratoService>(PessoaExtratoService);
    romaneioService = module.get<RomaneioService>(RomaneioService);
    romaneioItemService = module.get<RomaneioItemService>(RomaneioItemService);
    estoqueService = module.get<EstoqueService>(EstoqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(caixaExtratoService).toBeDefined();
    expect(pessoaExtratoService).toBeDefined();
    expect(contextService).toBeDefined();
    expect(romaneioService).toBeDefined();
    expect(romaneioItemService).toBeDefined();
    expect(estoqueService).toBeDefined();
  });

  describe('adiantamento', () => {
    const empresaId = 1;
    const caixaId = 1;
    const pessoaId = 2;
    const liquidacao = 1687556034328;
    const motivo = 'Motivo';

    it('should throw BadRequestException if liquidacao is not found', async () => {
      const dto: CancelarAdiantamentoDto = { pessoaId, liquidacao, motivo };

      jest.spyOn(caixaExtratoService, 'findByLiquidacao').mockResolvedValue(null);

      await expect(service.adiantamento(caixaId, dto)).rejects.toThrowError(`A liquidação ${liquidacao} não foi encontrada`);
    });

    it('should throw BadRequestException if liquidacao is not an adiantamento', async () => {
      const dto: CancelarAdiantamentoDto = { pessoaId, liquidacao, motivo };
      const liquidacaoMock = [{ tipoHistorico: TipoHistorico.Venda }] as any;

      jest.spyOn(caixaExtratoService, 'findByLiquidacao').mockResolvedValue(liquidacaoMock);

      await expect(service.adiantamento(caixaId, dto)).rejects.toThrowError(`A liquidação ${liquidacao} não é um adiantamento`);
    });

    it('should throw BadRequestException if liquidacao is already cancelled', async () => {
      const dto: CancelarAdiantamentoDto = { pessoaId, liquidacao, motivo };
      const liquidacaoMock = [{ tipoHistorico: TipoHistorico.Adiantamento, cancelado: true }] as any;

      jest.spyOn(caixaExtratoService, 'findByLiquidacao').mockResolvedValue(liquidacaoMock);

      await expect(service.adiantamento(caixaId, dto)).rejects.toThrowError(`A liquidação ${liquidacao} já foi cancelada`);
    });

    it('should throw BadRequestException if saldo adiantamento is insufficient', async () => {
      const dto: CancelarAdiantamentoDto = { pessoaId, liquidacao, motivo };
      const liquidacaoMock = [{ tipoHistorico: TipoHistorico.Adiantamento, valor: 100, cancelado: false }] as any;

      jest.spyOn(caixaExtratoService, 'findByLiquidacao').mockResolvedValue(liquidacaoMock);
      jest.spyOn(pessoaExtratoService, 'findSaldoAdiantamento').mockResolvedValue(50);

      await expect(service.adiantamento(caixaId, dto)).rejects.toThrowError(
        `Saldo em adiantamento insuficiente para realizar o cancelamento`
      );
    });

    it('should cancel liquidacao if all validations pass', async () => {
      const dto: CancelarAdiantamentoDto = { pessoaId, liquidacao, motivo };
      const liquidacaoMock = [{ tipoHistorico: TipoHistorico.Adiantamento, valor: 100, cancelado: false }] as any;

      jest.spyOn(caixaExtratoService, 'findByLiquidacao').mockResolvedValue(liquidacaoMock);
      jest.spyOn(pessoaExtratoService, 'findSaldoAdiantamento').mockResolvedValue(150);

      await service.adiantamento(caixaId, dto);

      expect(caixaExtratoService.cancelarLiquidacao).toHaveBeenCalledWith(empresaId, caixaId, liquidacao, motivo);
    });
  });

  describe('romaneio', () => {
    it('should throw BadRequestException if romaneio is not found', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 1, motivo: 'Motivo' };
      const error = new BadRequestException(`O romaneio "${dto.romaneioId}" não foi encontrado`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(null);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    it('should throw BadRequestException if romaneio is already cancelled', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 1, motivo: 'Motivo' };
      const error = new BadRequestException(`O romaneio "${dto.romaneioId}" já foi cancelado`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue({ situacao: SituacaoRomaneio.Cancelado } as any);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    it('should throw BadRequestException if romaneio is caixaId is different from caixaId request', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 1, motivo: 'Motivo' };
      const error = new BadRequestException(`O romaneio "${dto.romaneioId}" não pertence ao caixa "${caixaId}"`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue({ caixaId: 2, situacao: SituacaoRomaneio.Encerrado } as any);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    it('should throw BadRequestException if romaneio have items insufficient in stock', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 1, motivo: 'Motivo' };
      const romaneio = { caixaId: 1, situacao: SituacaoRomaneio.Encerrado, modalidade: ModalidadeRomaneio.Entrada } as any;
      const romaneioItens = [{ produtoId: 1, quantidade: 10 }] as any;
      const estoque = [{ produtoId: 1, saldo: 5 }] as any;
      const error = new BadRequestException(`O produto "1" não possui estoque suficiente para realizar o cancelamento`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(romaneioItemService, 'find').mockResolvedValue(romaneioItens);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValue(estoque);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    it('should throw BadRequestException if romaneio have credito de devolução insufficient', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 1, motivo: 'Motivo' };
      const romaneio = {
        caixaId: 1,
        situacao: SituacaoRomaneio.Encerrado,
        operacao: OperacaoRomaneio.Devolucao_Venda,
        valorLiquido: 100,
      } as any;
      const error = new BadRequestException(`Saldo de crédito de devolução insuficiente para realizar o cancelamento`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(pessoaExtratoService, 'findSaldoCreditoDeDevolucao').mockResolvedValue(50);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    it('should throw BadRequestException if romaneio have itens returned', async () => {
      const caixaId = 1;
      const dto: CancelarRomaneioDto = { romaneioId: 2, motivo: 'Motivo' };
      const romaneio = { caixaId: 1, situacao: SituacaoRomaneio.Encerrado, operacao: OperacaoRomaneio.Venda, valorLiquido: 100 } as any;
      const romaneioItens = [{ produtoId: 1, quantidade: 10, devolvido: 1, romaneiDevolucaoId: 1 }] as any;
      const estoque = [{ produtoId: 1, saldo: 10 }] as any;
      const error = new BadRequestException(`O romaneio "${dto.romaneioId}" já possui produtos devolvidos, não é possível cancelar`);

      jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneio);
      jest.spyOn(romaneioItemService, 'find').mockResolvedValue(romaneioItens);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValue(estoque);
      jest.spyOn(pessoaExtratoService, 'findSaldoCreditoDeDevolucao').mockResolvedValue(100);

      await expect(service.romaneio(caixaId, dto)).rejects.toThrow(error);
    });

    // it('should cancel romaneio if all validations pass', async () => {
    //   const romaneioMock = { cancelado: false } as any;

    //   jest.spyOn(romaneioService, 'findById').mockResolvedValue(romaneioMock);

    //   await service.romaneio(caixaId, romaneioId, motivo);

    //   expect(romaneioService.cancelar).toHaveBeenCalledWith(empresaId, caixaId, romaneioId, motivo);
    // });
  });
});
