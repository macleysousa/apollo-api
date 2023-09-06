import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { PedidoService } from '../pedido.service';
import { AddPedidoItemDto } from './dto/add-pedido-item.dto';
import { RemovePedidoItemDto } from './dto/remove-pedido-item.dto';
import { PedidoItemEntity } from './entities/pedido-item.entity';
import { ProdutoService } from 'src/modules/produto/produto.service';

@Injectable()
export class PedidoItemService {
  constructor(
    @InjectRepository(PedidoItemEntity)
    private readonly repository: Repository<PedidoItemEntity>,
    private readonly pedidoService: PedidoService,
    private readonly productService: ProdutoService,
    private readonly contextService: ContextService
  ) {}

  async add(pedidoId: number, dto: AddPedidoItemDto): Promise<PedidoItemEntity> {
    const operadorId = this.contextService.operadorId();
    const empresaId = this.contextService.empresaId();

    const pedido = await this.pedidoService.findById(pedidoId);

    if (!pedido) {
      throw new BadRequestException('Pedido não encontrado');
    } else if (pedido.situacao !== 'em_andamento') {
      throw new BadRequestException('Pedido não está em andamento');
    }

    const { valor } = await this.productService.findProductWithPrice(dto.produtoId, pedido.tabelaPrecoId);

    const sequencia = await this.repository
      .createQueryBuilder()
      .select('coalesce(max(sequencia), 0) + 1', 'sequencia')
      .where({ pedidoId })
      .getRawOne()
      .then((r) => r.sequencia);

    await this.repository.insert({ ...dto, sequencia, pedidoId, operadorId, empresaId, valorUnitario: valor });

    return this.repository.findOne({ where: { pedidoId, produtoId: dto.produtoId, sequencia } });
  }

  async findByPedidoId(pedidoId: number): Promise<PedidoItemEntity[]> {
    return this.repository.find({ where: { pedidoId } });
  }

  async findByProdutoId(pedidoId: number, produtoId: number): Promise<PedidoItemEntity[]> {
    return this.repository.find({ where: { pedidoId, produtoId } });
  }

  async remove(pedidoId: number, { produtoId, sequencia, quantidade }: RemovePedidoItemDto): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.pedidoService.findById(pedidoId);
    const item = await this.repository.findOne({ where: { pedidoId, produtoId, sequencia } });

    if (!pedido) {
      throw new BadRequestException('Pedido não encontrado');
    } else if (pedido.situacao !== 'em_andamento') {
      throw new BadRequestException('Pedido não está em andamento');
    } else if (!item) {
      throw new BadRequestException('Item não encontrado');
    }

    if (item.solicitado - quantidade <= 0) {
      await this.repository.delete({ pedidoId, produtoId, sequencia });
    } else {
      await this.repository.update({ pedidoId, produtoId, sequencia }, { solicitado: item.solicitado - quantidade, operadorId });
    }
  }
}
