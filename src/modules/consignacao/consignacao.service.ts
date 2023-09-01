import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CancelConsinacaoDto } from './dto/cancelar-consignacao.dto';
import { OpenConsignacaoDto } from './dto/open-consignacao.dto';
import { UpdateConsignacaoDto } from './dto/update-consignacao.dto';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { ConsignacaoFilter } from './filters/consignacao-filter';
import { ConsignacaoIncluir } from './includes/consignacao.includ';
import { RomaneioItemService } from '../romaneio/romaneio-item/romaneio-item.service';
import { ConsignacaoItemService } from './consignacao-item/consignacao-item.service';
import { UpsertConsignacaoItemDto } from './consignacao-item/dto/upsert-consignacao-item.dto';
import { ConsignacaoView } from './views/consignacao.view';

@Injectable()
export class ConsignacaoService {
  constructor(
    @InjectRepository(ConsignacaoEntity)
    private readonly repository: Repository<ConsignacaoEntity>,
    @InjectRepository(ConsignacaoView)
    private readonly view: Repository<ConsignacaoView>,
    private readonly contextService: ContextService,
    private readonly romanaioItemService: RomaneioItemService,
    private readonly consignacaoItemService: ConsignacaoItemService
  ) {}

  async open(dto: OpenConsignacaoDto): Promise<ConsignacaoView> {
    const operadorId = this.contextService.operadorId();
    const empresaId = this.contextService.empresaId();
    const dataAbertura = this.contextService.data();

    const pessoaConsignacao = await this.find({ empresaIds: [empresaId], pessoaIds: [dto.pessoaId], situacoes: ['aberta'] });
    if (pessoaConsignacao?.length > 0) {
      throw new BadRequestException('Já existe uma consignação aberta para esta pessoa');
    }

    const consignacao = await this.repository.save({ ...dto, empresaId, dataAbertura, operadorId, situacao: 'aberta' });

    return this.findById(empresaId, consignacao.id);
  }

  async find(filter: ConsignacaoFilter): Promise<ConsignacaoView[]> {
    const queryBuilder = this.view.createQueryBuilder('c');
    queryBuilder.where('c.empresaId IS NOT NULL');

    if (filter.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere('c.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
    }

    if (filter.pessoaIds && filter.pessoaIds.length > 0) {
      queryBuilder.andWhere('c.pessoaId IN (:...pessoaIds)', { pessoaIds: filter.pessoaIds });
    }

    if (filter.funcionarioIds && filter.funcionarioIds.length > 0) {
      queryBuilder.andWhere('c.funcionarioId IN (:...funcionarioIds)', { funcionarioIds: filter.funcionarioIds });
    }

    if (filter.situacoes && filter.situacoes.length > 0) {
      queryBuilder.andWhere('c.situacao IN (:...situacoes)', { situacoes: filter.situacoes });
    }

    return queryBuilder.getMany();
  }

  async calculate(id: number): Promise<void> {
    const romaneiosItens = await this.romanaioItemService.findByConsignacaoIds([id], undefined, ['encerrado']);

    const produtosSaida = romaneiosItens.filter((ri) => ri.operacao == 'consignacao_saida');
    const produtosDevolvidos = romaneiosItens.filter((ri) => ri.operacao == 'consignacao_devolucao');
    const produtosAcertados = romaneiosItens.filter((ri) => ri.operacao == 'consignacao_acerto');

    const produtos: UpsertConsignacaoItemDto[] = produtosSaida.map((ri) => {
      const quantidadeDevolvida = produtosDevolvidos
        .filter((x) => x.romaneioOrigemId == x.romaneioId)
        .filter((x) => x.romaneioOrigemSequencia == x.romaneioOrigemSequencia)
        .filter((x) => x.produtoId == ri.produtoId)
        .sum((ri) => ri.quantidade);

      const quantidadeAcertado = produtosAcertados
        .filter((x) => x.romaneioOrigemId == x.romaneioId)
        .filter((x) => x.romaneioOrigemSequencia == x.romaneioOrigemSequencia)
        .filter((x) => x.produtoId == ri.produtoId)
        .sum((ri) => ri.quantidade);

      return {
        empresaId: ri.empresaId,
        consignacaoId: ri.consignacaoId,
        romaneioId: ri.romaneioId,
        sequencia: ri.sequencia,
        produtoId: ri.produtoId,
        solicitado: ri.quantidade,
        devolvido: quantidadeDevolvida,
        acertado: quantidadeAcertado,
      };
    });

    await this.consignacaoItemService.upsert(produtos);
  }

  async findById(empresaId: number, id: number, relations?: ConsignacaoIncluir[]): Promise<ConsignacaoView> {
    const consignacoes = await this.view.find({ where: { empresaId, id }, relations });
    return consignacoes.first();
  }

  async update(empresaId: number, id: number, dto: UpdateConsignacaoDto): Promise<ConsignacaoView> {
    const operadorId = this.contextService.operadorId();
    const consignacao = await this.findById(empresaId, id);

    if (consignacao.situacao !== 'aberta') {
      throw new BadRequestException('Consignação não está com situação "aberta"');
    }

    await this.repository.update({ empresaId, id }, { ...dto, operadorId });

    return this.findById(empresaId, id);
  }

  async close(empresaId: number, id: number): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const consignacao = await this.findById(empresaId, id);

    if (consignacao.situacao !== 'aberta') {
      throw new BadRequestException('Consignação não está com situação "aberta"');
    } else if (consignacao.pendente > 0) {
      throw new BadRequestException('Consignação possui itens pendentes');
    }

    await this.repository.update({ empresaId, id }, { situacao: 'fechada', operadorId });
  }

  async cancel(empresaId: number, id: number, { motivoCancelamento }: CancelConsinacaoDto): Promise<void> {
    const operadorId = this.contextService.operadorId();
    const consignacao = await this.findById(empresaId, id);

    if (consignacao.situacao !== 'aberta') {
      throw new BadRequestException('Consignação não está com situação "aberta"');
    } else if (consignacao.pendente > 0) {
      throw new BadRequestException('Consignação possui itens pendentes');
    } else if (consignacao.acertado > 0) {
      throw new BadRequestException('Consignação já possui itens acertados');
    }

    await this.repository.update({ empresaId, id }, { situacao: 'cancelada', motivoCancelamento, operadorId });
  }
}
