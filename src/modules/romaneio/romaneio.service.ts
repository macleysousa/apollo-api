import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { EmpresaParametroService } from '../empresa/parametro/parametro.service';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { OperacaoRomaneio, OperacaoRomaneioType } from './enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { RomaneioView } from './views/romaneio.view';
import { RomaneioInclude } from './includes/romaneio.include';
import { RomaneioFilter } from './filters/romaneio.filter';

@Injectable()
export class RomaneioService {
  constructor(
    @InjectRepository(RomaneioEntity)
    private readonly repository: Repository<RomaneioEntity>,
    @InjectRepository(RomaneioView)
    private readonly view: Repository<RomaneioView>,
    private readonly contextService: ContextService,
    private readonly empresaParamService: EmpresaParametroService
  ) {}

  async create(createRomaneioDto: CreateRomaneioDto): Promise<RomaneioView> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();
    const parametro = await this.empresaParamService.find(empresa.id);

    let observacao = '';
    switch (createRomaneioDto.operacao) {
      case OperacaoRomaneio.Compra:
        observacao = parametro.find((p) => p.parametroId === 'OBS_PADRAO_COMPRA')?.valor ?? '';
        break;
      case OperacaoRomaneio.Venda:
        observacao = parametro.find((p) => p.parametroId === 'OBS_PADRAO_VENDA')?.valor ?? '';
        break;
    }

    const romaneio = await this.repository.save({
      ...createRomaneioDto,
      empresaId: empresa.id,
      data: empresa.data,
      observacao: observacao,
      operadorId: usuario.id,
      situacao: SituacaoRomaneio.EmAndamento,
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

  async observacao(empresaId: number, id: number, { observacao }: OperacaoRomaneioDto): Promise<RomaneioView> {
    const romaneio = await this.findById(empresaId, id);

    if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.update({ id }, { observacao }).catch(() => {
      throw new BadRequestException('Não foi possível encerrar o romaneio');
    });

    return this.findById(empresaId, id);
  }

  async validarDevolucao(empresaId: number, id: number, operacao: OperacaoRomaneioType, romaneiosDevolucao: number[]): Promise<Boolean> {
    const data = this.contextService.data();
    const parametros = this.contextService.parametros();

    const romaneios = await this.findByIds(empresaId, romaneiosDevolucao, ['itens']);
    const romaneio = await this.findById(empresaId, id, ['itens']);

    if (romaneios.filter((x) => x.operacao != operacao).length > 0) {
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
    const romaneio = await this.findById(empresaId, id);

    if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.update({ id }, { caixaId, situacao: SituacaoRomaneio.Encerrado, liquidacao }).catch(() => {
      throw new BadRequestException('Não foi possível encerrar o romaneio');
    });

    return this.findById(empresaId, id);
  }

  async cancelar(empresaId: number, id: number, motivo: string): Promise<RomaneioView> {
    const operadorId = this.contextService.usuario().id;

    await this.repository.update({ id }, { situacao: SituacaoRomaneio.Cancelado, motivoCancelamento: motivo, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível cancelar o romaneio');
    });

    return this.findById(empresaId, id);
  }
}
