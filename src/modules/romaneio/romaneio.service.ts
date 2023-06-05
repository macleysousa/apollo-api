import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, IsNull, Not, Repository } from 'typeorm';

import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { ContextService } from 'src/context/context.service';

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
    private readonly contextService: ContextService
  ) {}

  async create(createRomaneioDto: CreateRomaneioDto): Promise<RomaneioEntity> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const romaneio = await this.repository.save({
      ...createRomaneioDto,
      empresaId: empresa.id,
      data: empresa.data,
      operadorId: usuario.id,
      situacao: SituacaoRomaneio.EmAndamento,
    });

    return this.findById(romaneio.id);
  }

  async find(filter?: filter, page = 1, limit = 100): Promise<Pagination<RomaneioEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('e');
    queryBuilder.where({ empresaId: Not(IsNull()) });

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

    return paginate<RomaneioEntity>(queryBuilder, { page, limit });
  }

  async findById(id: number): Promise<RomaneioEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async cancelar(id: number): Promise<RomaneioEntity> {
    await this.repository.update({ id }, { situacao: SituacaoRomaneio.Cancelado });

    return this.findById(id);
  }
}
