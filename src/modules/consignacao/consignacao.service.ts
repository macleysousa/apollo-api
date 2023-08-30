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

@Injectable()
export class ConsignacaoService {
  constructor(
    @InjectRepository(ConsignacaoEntity)
    private readonly repository: Repository<ConsignacaoEntity>,
    private readonly contextService: ContextService
  ) {}

  async open(dto: OpenConsignacaoDto): Promise<ConsignacaoEntity> {
    const operadorId = this.contextService.operadorId();
    const empresaId = this.contextService.empresaId();
    const dataAbertura = this.contextService.data();

    const pessoaConsignacao = await this.find({ empresaIds: [empresaId], pessoaIds: [dto.pessoaId], situacoes: ['aberta'] });
    if (pessoaConsignacao.length > 0) {
      throw new BadRequestException('Já existe uma consignação aberta para esta pessoa');
    }

    const consignacao = await this.repository.save({ ...dto, empresaId, dataAbertura, operadorId, situacao: 'aberta' });

    return this.findById(empresaId, consignacao.id);
  }

  async find(filter: ConsignacaoFilter): Promise<ConsignacaoEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where('c.empresaId IS NOT NULL');

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere('c.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
    }

    if (filter?.pessoaIds && filter.pessoaIds.length > 0) {
      queryBuilder.andWhere('c.pessoaId IN (:...pessoaIds)', { pessoaIds: filter.pessoaIds });
    }

    if (filter?.funcionarioIds && filter.funcionarioIds.length > 0) {
      queryBuilder.andWhere('c.funcionarioId IN (:...funcionarioIds)', { funcionarioIds: filter.funcionarioIds });
    }

    if (filter?.situacoes && filter.situacoes.length > 0) {
      queryBuilder.andWhere('c.situacao IN (:...situacoes)', { situacoes: filter.situacoes });
    }

    return queryBuilder.getMany();
  }

  async findById(empresaId: number, id: number, relations?: ConsignacaoIncluir[]): Promise<ConsignacaoEntity> {
    return this.repository.findOne({ where: { empresaId, id }, relations });
  }

  async update(empresaId: number, id: number, dto: UpdateConsignacaoDto): Promise<ConsignacaoEntity> {
    const operadorId = this.contextService.operadorId();
    const consignacao = await this.findById(empresaId, id);

    if (consignacao.situacao !== 'aberta') {
      throw new BadRequestException('Consignação não está com situação "aberta"');
    }

    await this.repository.update({ empresaId, id }, { ...dto, operadorId });

    return this.findById(empresaId, id);
  }

  async cancel(empresaId: number, id: number, { motivoCancelamento }: CancelConsinacaoDto): Promise<void> {
    const operadorId = this.contextService.operadorId();
    const consignacao = await this.findById(empresaId, id, ['itens']);

    if (consignacao.situacao !== 'aberta') {
      throw new BadRequestException('Consignação não está com situação "aberta"');
    }

    if (consignacao.itens.length > 0) {
      throw new BadRequestException('Consignação possui itens');
    }

    await this.repository.update({ empresaId, id }, { situacao: 'cancelada', motivoCancelamento, operadorId });
  }
}
