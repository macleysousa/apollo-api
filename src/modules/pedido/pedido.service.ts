import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { EstoqueService } from '../estoque/estoque.service';
import { RomaneioItemService } from '../romaneio/romaneio-item/romaneio-item.service';
import { RomaneioService } from '../romaneio/romaneio.service';
import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoEntity } from './entities/pedido.entity';
import { PedidoFilter } from './filters/pedido.filters';
import { PedidoInclude } from './includes/pedido.include';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly repository: Repository<PedidoEntity>,
    private readonly contextService: ContextService,
    private readonly estoqueService: EstoqueService,
    private readonly romaneioService: RomaneioService
  ) {}

  async create(dto: CreatePedidoDto): Promise<PedidoEntity> {
    const empresaId = this.contextService.empresaId();
    const operadorId = this.contextService.operadorId();

    let financeiro = true;

    switch (dto.tipo) {
      case 'transferencia':
        financeiro = false;
        break;
    }

    const pedido = await this.repository.save({ ...dto, empresaId, situacao: 'em_andamento', financeiro, operadorId });

    return this.findById(pedido.id);
  }

  async find(filter: PedidoFilter): Promise<PedidoEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('p');
    queryBuilder.where('p.empresaId IS NOT NULL');

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere('e.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
    }

    if (filter?.pessoaIds && filter.pessoaIds.length > 0) {
      queryBuilder.andWhere('e.pessoaId IN (:...pessoaIds)', { pessoaIds: filter.pessoaIds });
    }

    if (filter?.funcionarioIds && filter.funcionarioIds.length > 0) {
      queryBuilder.andWhere('e.funcionarioId IN (:...funcionarioIds)', { funcionarioIds: filter.funcionarioIds });
    }

    if (filter?.tipos && filter.tipos.length > 0) {
      queryBuilder.andWhere('e.tipo IN (:...tipos)', { tipos: filter.tipos });
    }

    if (filter?.situacoes && filter.situacoes.length > 0) {
      queryBuilder.andWhere('e.situacao IN (:...situacoes)', { situacoes: filter.situacoes });
    }

    return queryBuilder.getMany();
  }

  async findById(id: number, includes?: PedidoInclude[]): Promise<PedidoEntity> {
    return this.repository.findOne({ where: { id }, relations: includes });
  }

  async update(id: number, dto: UpdatePedidoDto): Promise<PedidoEntity> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.situacao !== 'em_andamento') {
      throw new BadRequestException('Não é possível alterar um pedido que não esteja em andamento');
    }

    await this.repository.update({ id }, { ...dto, operadorId });

    return this.findById(id);
  }

  async conferir(id: number, processarComDivegencia?: boolean): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id, ['itens']);

    if (pedido.situacao !== 'em_andamento') {
      throw new BadRequestException('Não é possível conferir um pedido que não esteja em andamento');
    }

    const produtos = pedido.itens;
    const produtosDivergentes = produtos.filter((x) => x.solicitado !== x.atendido);

    if (produtosDivergentes.length > 0 && !processarComDivegencia) {
      throw new BadRequestException('Foi encontrado uma divergência entre a quantidade solicitada e a quantidade atendida');
    }

    await this.repository.update({ id }, { situacao: 'conferido', operadorId });
  }

  async faturar(id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();
    const empresaId = this.contextService.empresaId();

    const pedido = await this.findById(id, ['itens']);

    if (pedido.situacao !== 'conferido') {
      throw new BadRequestException('Não é possível faturar um pedido que não esteja conferido');
    } else if (pedido.itens.filter((x) => x.atendido > 0).length === 0) {
      throw new BadRequestException('Não é possível faturar um pedido sem itens');
    }

    const produtos = pedido.itens
      .groupBy((g) => g.produtoId)
      .select((s) => ({
        produtoId: s.key,
        solicitado: s.values.sum((x) => Number(x.atendido)),
        atendido: s.values.sum((x) => Number(x.atendido)),
      }));

    const produtoIds = produtos.map((item) => item.produtoId);

    const estoque = await this.estoqueService.findByProdutoIds(empresaId, produtoIds);

    const prdsInsufi = produtos.filter((e) => estoque.first((x) => x.produtoId === e.produtoId).saldo < e.atendido);
    if (prdsInsufi.length > 0) {
      throw new BadRequestException(`Não há saldo suficiente para os produtos: ${prdsInsufi.map((e) => e.produtoId).join(', ')}`);
    }

    let operacao: 'compra' | 'venda' | 'transferencia_saida';
    switch (pedido.tipo) {
      case 'compra':
        operacao = 'compra';
        break;
      case 'venda':
        operacao = 'venda';
        break;
      case 'transferencia':
        operacao = 'transferencia_saida';
        break;
    }

    const romaneio = await this.romaneioService.create({
      pessoaId: pedido.pessoaId,
      tabelaPrecoId: pedido.tabelaPrecoId,
      funcionarioId: operadorId,
      operacao: operacao,
      pedidoId: pedido.id,
    });

    await this.repository.query(
      `
insert into romaneios_itens (empresaId, romaneioId, data, sequencia, referenciaId, produtoId, quantidade, valorUnitario, valorUnitDesconto, operadorId)
(select i.empresaId, ${romaneio.romaneioId}, e.data, i.sequencia, p.referenciaId, i.produtoId, i.atendido, i.valorUnitario, i.valorUnitDesconto, i.operadorId
from pedidos_itens i
inner join empresas e on e.id = i.empresaId
inner join produtos p on p.id = i.produtoId
where i.pedidoId = ${id} and i.atendido > 0)
      `
    );

    await this.repository.update({ id }, { situacao: 'faturado', romaneioOrigemId: romaneio.romaneioId, operadorId });
  }

  async encerrar(id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.situacao !== 'faturado') {
      throw new BadRequestException('Não é possível encerrar um pedido que não esteja faturado');
    }

    await this.repository.update({ id }, { situacao: 'encerrado', operadorId });
  }

  async cancel(id: number, dto: CancelPedidoDto): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.romaneioDestinoId) {
      throw new BadRequestException('Não é possível cancelar um pedido que já foi transferido');
    }

    await this.repository.update({ id }, { situacao: 'cancelado', motivoCancelamento: dto.motivoCancelamento, operadorId });
  }
}
