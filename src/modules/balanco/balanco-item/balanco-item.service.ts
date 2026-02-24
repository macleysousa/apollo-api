import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

import { BalancoService } from '../balanco.service';
import { SituacaoBalanco } from '../enum/situacao-balanco.enum';

import { AddRemoveBalancoItemDto } from './dto/add-remove-balanco-item.dto';
import { BalancoItemEntity } from './entities/balanco-item.entity';

@Injectable()
export class BalancoItemService {
  constructor(
    @InjectRepository(BalancoItemEntity)
    private readonly repository: Repository<BalancoItemEntity>,
    @Inject(forwardRef(() => BalancoService))
    private readonly balancoService: BalancoService,
    private readonly estoqueService: EstoqueService,
    private readonly contextService: ContextService,
  ) {}

  async add(balancoId: number, { produtoId }: AddRemoveBalancoItemDto): Promise<void> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const estoque = await this.estoqueService.findByProdutoId(empresa.id, produtoId);
    if (!estoque) {
      throw new BadRequestException('Produto não encontrado em estoque');
    }

    const item = await this.repository.findOne({ where: { empresaId: empresa.id, balancoId, produtoId } });

    if (item) {
      throw new BadRequestException('Produto já adicionado ao balanço', {
        description: 'O produto já foi adicionado ao balanço, não é permitido adicionar o mesmo produto mais de uma vez',
      });
    }

    const sequencia = await this.repository
      .createQueryBuilder('i')
      .select('coalesce(max(i.sequencia), 0) + 1', 'sequencia')
      .where('i.empresaId = :empresaId', { empresaId: empresa.id })
      .andWhere('i.balancoId = :balancoId', { balancoId })
      .getRawOne()
      .then((r) => Number(r.sequencia));

    await this.repository.insert({
      empresaId: empresa.id,
      balancoId,
      sequencia,
      produtoId,
      quantidadeContada: 0,
      quantidadeOriginal: Number(estoque.saldo ?? 0),
      operadorId,
    });
  }

  async findByBalancoId(balancoId: number): Promise<BalancoItemEntity[]> {
    const empresaId = this.contextService.empresaId();
    return this.repository.find({ where: { empresaId, balancoId }, order: { sequencia: 'ASC' } });
  }

  async remove(balancoId: number, produtoId: number): Promise<void> {
    const empresa = this.contextService.empresa();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const item = await this.repository.findOne({ where: { empresaId: empresa.id, balancoId, produtoId } });
    if (!item) {
      throw new BadRequestException('Item não encontrado');
    }

    await this.repository.delete({ empresaId: empresa.id, balancoId, produtoId });
  }
}
