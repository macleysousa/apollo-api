import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoEntity } from './entities/pedido.entity';
import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { PedidoFilter } from './filters/pedido.filters';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly repository: Repository<PedidoEntity>,
    private readonly contextService: ContextService
  ) {}

  async create(dto: CreatePedidoDto): Promise<PedidoEntity> {
    const empresaId = this.contextService.empresaId();
    const operadorId = this.contextService.operadorId();

    let financeiro = true;
    let kardex = true;

    switch (dto.tipo) {
      case 'transferencia':
        financeiro = false;
        kardex = true;
        break;
    }

    const pedido = await this.repository.save({ ...dto, empresaId, situacao: 'em_andamento', kardex, financeiro, operadorId });

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

  async findById(id: number): Promise<PedidoEntity> {
    return this.repository.findOne({ where: { id } });
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

  async cancel(id: number, dto: CancelPedidoDto): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const pedido = await this.findById(id);

    if (pedido.romaneioDestinoId) {
      throw new BadRequestException('Não é possível cancelar um pedido que já foi transferido');
    }

    await this.repository.update({ id }, { situacao: 'cancelado', motivoCancelamento: dto.motivoCancelamento, operadorId });
  }
}
