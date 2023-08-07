import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, IsNull, Not, Repository } from 'typeorm';

import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { ContextService } from 'src/context/context.service';
import { RomaneioView } from './views/romaneio.view';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { EmpresaParametroService } from '../empresa/parametro/parametro.service';
import { OperacaoRomaneio } from './enum/operacao-romaneio.enum';

interface filter {
  empresaIds: number[];
  funcionarioIds: number[];
  dataInicial: Date;
  dataFinal: Date;
}

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
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();
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

  async find(filter?: filter, page = 1, limit = 100): Promise<Pagination<RomaneioView>> {
    const queryBuilder = this.view.createQueryBuilder('e');
    queryBuilder.where('e.empresaId IS NOT NULL');

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere({ empresaId: In(filter.empresaIds) });
    }

    if (filter?.funcionarioIds && filter.funcionarioIds.length > 0) {
      queryBuilder.andWhere({ funcionarioId: In(filter.funcionarioIds) });
    }

    if (filter?.dataInicial) {
      queryBuilder.andWhere('e.data >= :dataInicial', { dataInicial: filter.dataInicial });
    }

    if (filter?.dataFinal) {
      queryBuilder.andWhere('e.data <= :dataFinal', { dataFinal: filter.dataFinal });
    }

    return paginate<RomaneioView>(queryBuilder, { page, limit });
  }

  async findById(empresaId: number, id: number): Promise<RomaneioView> {
    return this.view.findOne({ where: { empresaId: empresaId, romaneioId: id } });
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

  async encerrar(empresaId: number, caixaId: number, id: number): Promise<void> {
    const romaneio = await this.findById(empresaId, id);

    if (romaneio.situacao !== SituacaoRomaneio.EmAndamento) {
      throw new BadRequestException('Romaneio não está em andamento');
    }

    await this.repository.update({ id }, { caixaId, situacao: SituacaoRomaneio.Encerrado }).catch(() => {
      throw new BadRequestException('Não foi possível encerrar o romaneio');
    });
  }

  async cancelar(empresaId: number, id: number): Promise<RomaneioView> {
    const romaneio = await this.findById(empresaId, id);
    const empresa = this.contextService.currentBranch();

    if (romaneio.data.getTime() !== empresa.data.getTime()) {
      throw new BadRequestException('Romaneio não pode ser cancelado. Data diferente da data da empresa');
    }

    await this.repository.update({ id }, { situacao: SituacaoRomaneio.Cancelado }).catch(() => {
      throw new BadRequestException('Não foi possível cancelar o romaneio');
    });

    return this.findById(empresaId, id);
  }
}
