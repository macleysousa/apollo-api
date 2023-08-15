import { Test, TestingModule } from '@nestjs/testing';

import { ContextService } from 'src/context/context.service';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';

import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';
import { CancelarService } from './cancelar.service';
import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { RomaneioItemService } from 'src/modules/romaneio/romaneio-item/romaneio-item.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

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
          },
        },
        {
          provide: RomaneioService,
          useValue: {},
        },
        {
          provide: RomaneioItemService,
          useValue: {},
        },
        {
          provide: EstoqueService,
          useValue: {},
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
});
