import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { EstoqueService } from '../estoque/estoque.service';
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
    @Inject(forwardRef(() => ContextService))
    private readonly contextService: ContextService,
    @Inject(forwardRef(() => EstoqueService))
    private readonly estoqueService: EstoqueService,
    @Inject(forwardRef(() => RomaneioService))
    private readonly romaneioService: RomaneioService,
  ) {}

  async create(dto: CreatePedidoDto): Promise<PedidoEntity> {
    const empresaId = this.contextService.empresaId();
    const operadorId = this.contextService.operadorId();

    let financeiro = true;

    switch (dto.tipo) {
      case 'transferencia_saida':
        financeiro = false;
        break;
      case 'transferencia_entrada':
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

  async cancelarConferencia(id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.situacao != 'conferido') {
      throw new BadRequestException('Não é possível cancelar a conferência de um pedido que não esteja situação "conferido"');
    }

    await this.repository.save({ ...pedido, situacao: 'em_andamento', operadorId });
  }

  async faturar(id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();
    const empresaId = this.contextService.empresaId();
    const parametros = this.contextService.parametros();
    const FATURAR_PEDIDO_SEM_CONFERENCIA = parametros.first((x) => x.parametroId == 'FATURAR_PEDIDO_SEM_CONFERENCIA');

    const pedido = await this.findById(id, ['itens']);

    if (pedido.situacao == 'encerrado') {
      throw new BadRequestException('Não é possível faturar um pedido que já foi encerrado');
    } else if (pedido.situacao == 'cancelado') {
      throw new BadRequestException('Não é possível faturar um pedido que já foi cancelado');
    } else if (pedido.situacao == 'em_andamento' && FATURAR_PEDIDO_SEM_CONFERENCIA.valor == 'N') {
      throw new BadRequestException('Não é possível faturar um pedido que não esteja conferido');
    }

    if (pedido.tipo == 'venda' || pedido.tipo == 'transferencia_saida') {
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
        throw new BadRequestException(
          `Não há saldo suficiente para os produtos: ${prdsInsufi.map((e) => e.produtoId).join(', ')}`,
        );
      }
    }

    const romaneio = await this.romaneioService.create({
      pessoaId: pedido.pessoaId,
      tabelaPrecoId: pedido.tabelaPrecoId,
      funcionarioId: operadorId,
      operacao: pedido.tipo,
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
      `,
    );

    if (pedido.tipo == 'transferencia_saida') {
      pedido.romaneioOrigemId = romaneio.romaneioId;
    } else if (pedido.tipo == 'transferencia_entrada') {
      pedido.romaneioDestinoId = romaneio.romaneioId;
    }

    await this.repository.save({ ...pedido, situacao: 'encerrado', operadorId });
  }

  async cancelarFaturamento(id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.situacao != 'encerrado') {
      throw new BadRequestException('Não é possível cancelar o faturamento de um pedido que não esteja encerrado');
    } else if (pedido.tipo == 'transferencia_saida' && pedido.romaneioOrigemId) {
      throw new BadRequestException('Não é possível cancelar o faturamento de um pedido que já foi recebido no destino');
    }

    if (pedido.tipo == 'venda' || pedido.tipo == 'transferencia_saida') {
      pedido.romaneioOrigemId = null;
    } else if (pedido.tipo == 'compra' || pedido.tipo == 'transferencia_entrada') {
      pedido.romaneioDestinoId = null;
    }

    await this.repository.save({ ...pedido, situacao: 'conferido', operadorId });
  }

  async cancel(id: number, dto: CancelPedidoDto): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.situacao == 'encerrado') {
      throw new BadRequestException('Não é possível cancelar um pedido que está com situação "encerrado"');
    }

    await this.repository.update({ id }, { situacao: 'cancelado', motivoCancelamento: dto.motivoCancelamento, operadorId });
  }
}
