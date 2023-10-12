import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoService } from '../consignacao/consignacao.service';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { UpdateRomaneioDto } from './dto/update-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { ModalidadeRomaneio } from './enum/modalidade-romaneio.enum';
import { OperacaoRomaneio, OperacaoRomaneioType } from './enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { RomaneioFilter } from './filters/romaneio.filter';
import { RomaneioInclude } from './includes/romaneio.include';
import { RomaneioView } from './views/romaneio.view';
import { PedidoService } from '../pedido/pedido.service';

@Injectable()
export class RomaneioService {
  constructor(
    @InjectRepository(RomaneioEntity)
    private readonly repository: Repository<RomaneioEntity>,
    @InjectRepository(RomaneioView)
    private readonly view: Repository<RomaneioView>,
    @Inject(forwardRef(() => ContextService))
    private readonly contextService: ContextService,
    @Inject(forwardRef(() => ConsignacaoService))
    private readonly consignacaoService: ConsignacaoService,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService
  ) {}

  async create(dto: CreateRomaneioDto): Promise<RomaneioView> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();
    const parametro = this.contextService.parametros();

    if (dto.operacao == OperacaoRomaneio.consignacao_saida && !dto.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    } else if (dto.operacao == OperacaoRomaneio.consignacao_devolucao && !dto.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    } else if (dto.operacao == OperacaoRomaneio.consignacao_acerto && !dto.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    } else if (dto.operacao == OperacaoRomaneio.consignacao_devolucao && !dto.romaneiosConsignacao) {
      throw new BadRequestException('Romaneios de consignação saída não informados');
    } else if (dto.operacao == OperacaoRomaneio.consignacao_acerto && !dto.romaneiosConsignacao) {
      throw new BadRequestException('Romaneios de consignação saída não informados');
    } else if (dto.operacao == OperacaoRomaneio.compra_devolucao && !dto.romaneiosDevolucao) {
      throw new BadRequestException('Romaneios de devolução não informados');
    } else if (dto.operacao == OperacaoRomaneio.venda_devolucao && !dto.romaneiosDevolucao) {
      throw new BadRequestException('Romaneios de devolução não informados');
    } else if (dto.operacao == OperacaoRomaneio.transferencia_devolucao && !dto.romaneiosDevolucao) {
      throw new BadRequestException('Romaneios de devolução não informados');
    }

    let modalidade = ModalidadeRomaneio.saida;
    let kardex = true;
    let financeiro = true;
    let observacao = '';

    switch (dto.operacao) {
      case OperacaoRomaneio.compra:
        modalidade = ModalidadeRomaneio.entrada;
        observacao = parametro.first((p) => p.parametroId === 'OBS_PADRAO_COMPRA').valor;
        break;
      case OperacaoRomaneio.compra_devolucao:
        modalidade = ModalidadeRomaneio.saida;
        break;
      case OperacaoRomaneio.venda:
        modalidade = ModalidadeRomaneio.saida;
        observacao = parametro.find((p) => p.parametroId === 'OBS_PADRAO_VENDA').valor;
        break;
      case OperacaoRomaneio.venda_devolucao:
        modalidade = ModalidadeRomaneio.entrada;
        break;
      case OperacaoRomaneio.consignacao_saida:
        modalidade = ModalidadeRomaneio.saida;
        financeiro = false;
        observacao = parametro.find((p) => p.parametroId === 'OBS_PADRAO_CONSIGNACAO').valor;
        break;
      case OperacaoRomaneio.consignacao_devolucao:
        modalidade = ModalidadeRomaneio.entrada;
        financeiro = false;
        break;
      case OperacaoRomaneio.consignacao_acerto:
        modalidade = ModalidadeRomaneio.saida;
        kardex = false;
        observacao = parametro.find((p) => p.parametroId === 'OBS_PADRAO_VENDA').valor;
        break;
      case OperacaoRomaneio.transferencia_saida:
        modalidade = ModalidadeRomaneio.saida;
        financeiro = false;
        break;
      case OperacaoRomaneio.transferencia_entrada:
        modalidade = ModalidadeRomaneio.entrada;
        financeiro = false;
        break;
    }

    const romaneio = await this.repository.save({
      ...dto,
      empresaId: empresa.id,
      data: empresa.data,
      modalidade: modalidade,
      kardex: kardex,
      financeiro: financeiro,
      observacao: observacao,
      operadorId: usuario.id,
      situacao: SituacaoRomaneio.em_andamento,
    });

    return this.findById(romaneio.empresaId, romaneio.id);
  }

  async find(filter?: RomaneioFilter, page = 1, limit = 100): Promise<Pagination<RomaneioView>> {
    const queryBuilder = this.view.createQueryBuilder('e');
    queryBuilder.where('e.empresaId IS NOT NULL');

    if (filter?.dataInicial) {
      queryBuilder.andWhere('e.data >= :dataInicial', { dataInicial: filter.dataInicial });
    }

    if (filter?.dataFinal) {
      queryBuilder.andWhere('e.data <= :dataFinal', { dataFinal: filter.dataFinal });
    }

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere('e.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
    }

    if (filter?.pessoaIds && filter.pessoaIds.length > 0) {
      queryBuilder.andWhere('e.pessoaId IN (:...pessoaIds)', { pessoaIds: filter.pessoaIds });
    }

    if (filter?.funcionarioIds && filter.funcionarioIds.length > 0) {
      queryBuilder.andWhere('e.funcionarioId IN (:...funcionarioIds)', { funcionarioIds: filter.funcionarioIds });
    }

    if (filter?.modalidades && filter.modalidades.length > 0) {
      queryBuilder.andWhere('e.modalidade IN (:...modalidades)', { modalidades: filter.modalidades });
    }

    if (filter?.operacoes && filter.operacoes.length > 0) {
      queryBuilder.andWhere('e.operacao IN (:...operacoes)', { operacoes: filter.operacoes });
    }

    if (filter?.situacoes && filter.situacoes.length > 0) {
      queryBuilder.andWhere('e.situacao IN (:...situacoes)', { situacoes: filter.situacoes });
    }

    if (filter?.incluir && filter.incluir.includes('itens')) {
      queryBuilder.leftJoinAndSelect('e.itens', 'i');
    }

    return paginate<RomaneioView>(queryBuilder, { page, limit });
  }

  async findById(empresaId: number, id: number, relations?: RomaneioInclude[]): Promise<RomaneioView> {
    // usado find porque o findOne estava retornando erro ao passar as relations
    const romaneio = await this.view.find({ where: { empresaId: empresaId, romaneioId: id }, relations });
    return romaneio.first();
  }

  async findByIds(empresaId: number, ids: number[], relations?: RomaneioInclude[]): Promise<RomaneioView[]> {
    return this.view.find({ where: { empresaId: empresaId, romaneioId: In(ids) }, relations });
  }

  async update(empresaId: number, id: number, updateRomaneioDto: UpdateRomaneioDto): Promise<RomaneioView> {
    const operadorId = this.contextService.operadorId();

    const romaneio = await this.findById(empresaId, id, ['itens']);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    }

    if (romaneio.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    if (romaneio.itens && romaneio.itens.length > 0) {
      throw new BadRequestException(`Romaneio "${id}" não pode ser alterado pois já possui itens`);
    }

    await this.repository.update({ id }, { ...updateRomaneioDto, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível atualizar o romaneio');
    });

    return this.findById(empresaId, id);
  }

  async observacao(empresaId: number, id: number, { observacao }: OperacaoRomaneioDto): Promise<RomaneioView> {
    const romaneio = await this.findById(empresaId, id);

    if (romaneio.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.update({ id }, { observacao }).catch(() => {
      throw new BadRequestException('Não foi possível encerrar o romaneio');
    });

    return this.findById(empresaId, id);
  }

  async validarDevolucao(empresaId: number, id: number, operacao: OperacaoRomaneioType[], romaneiosDevolucao: number[]): Promise<Boolean> {
    const data = this.contextService.data();
    const parametros = this.contextService.parametros();

    const romaneios = await this.findByIds(empresaId, romaneiosDevolucao, ['itens']);
    const romaneio = await this.findById(empresaId, id, ['itens']);

    if (romaneios.filter((x) => !operacao.includes(x.operacao)).length > 0) {
      throw new BadRequestException('Devolução não permitida. Verifique o tipo de operação dos romaneios selecionados.');
    }

    const romaneioItens = romaneios.map((r) => r.itens).flat();
    const produtos = romaneioItens
      .filter((i) => new Date(i.data) >= new Date(data).addDays(-parametros.first((p) => p.parametroId == 'QT_DIAS_DEVOLUCAO').valor))
      .groupBy((i) => i.produtoId)
      .select((i) => ({
        produtoId: i.key,
        devolvido: i.values.sum((i) => i.devolvido),
        quantidade: i.values.sum((i) => i.quantidade),
      }));

    const produtosErros = [];
    await Promise.all(
      produtos.map((p) => {
        const quantidadeDevoldida = romaneio.itens.filter((f) => f.produtoId == p.produtoId).sum((i) => i.quantidade);
        const saldoDevolucao = p.quantidade - p.devolvido;
        if (quantidadeDevoldida > saldoDevolucao) {
          produtosErros.push(p.produtoId);
        }
      })
    );

    return produtosErros.length == 0;
  }

  async encerrar(empresaId: number, caixaId: number, id: number, liquidacao?: number): Promise<RomaneioView> {
    const operadorId = this.contextService.usuario().id;

    const romaneio = await this.findById(empresaId, id);

    if (romaneio.situacao !== SituacaoRomaneio.em_andamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.update({ id }, { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível encerrar o romaneio');
    });

    if (romaneio.romaneiosDevolucao && romaneio.romaneiosDevolucao.length > 0) {
      await this.repository.query(`CALL romaneio_calcular_itens_devidos(${id})`);
    }

    if (romaneio.consignacaoId) {
      await this.consignacaoService.calculate(romaneio.consignacaoId);
    }

    return this.findById(empresaId, id);
  }

  async cancelar(empresaId: number, id: number, motivo: string): Promise<RomaneioView> {
    const operadorId = this.contextService.usuario().id;

    const romaneio = await this.findById(empresaId, id);

    if (romaneio.pedidoId) {
      const pedido = await this.pedidoService.findById(romaneio.pedidoId);
      if (pedido.tipo == 'transferencia_saida' && pedido.romaneioDestinoId) {
        throw new BadRequestException('Não é possível cancelar um romaneio de transferência que já foi recebido no destino');
      }
    }

    await this.repository.update({ id }, { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível cancelar o romaneio');
    });

    if (romaneio.romaneiosDevolucao && romaneio.romaneiosDevolucao.length > 0) {
      await this.repository.query(`CALL romaneio_cancelar_itens_devolvidos(${id})`);
    }

    if (romaneio.consignacaoId) {
      await this.consignacaoService.calculate(romaneio.consignacaoId);
    }

    if (romaneio.pedidoId) {
      this.pedidoService.cancelarFaturamento(romaneio.pedidoId);
    }

    return this.findById(empresaId, id);
  }
}
