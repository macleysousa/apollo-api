import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { TabelaDePrecoService } from '../tabela-de-preco.service';
import { ImportPrecoDto } from './dto/import-precos.dto';
import { AddPrecoReferenciaDto } from './dto/add-referencia.dto';
import { PrecoReferencia } from './entities/referencia.entity';
import { PrecoReferenciaView } from './views/referencia.view';

interface FindOptions {
  referenciaIds?: number[];
  referenciaIdExternos?: string[];
  page?: number;
  limit?: number;
}

@Injectable()
export class PrecoReferenciaService {
  constructor(
    @InjectRepository(PrecoReferencia)
    private readonly repository: Repository<PrecoReferencia>,
    @InjectRepository(PrecoReferenciaView)
    private readonly view: Repository<PrecoReferenciaView>,
    private readonly tabelaService: TabelaDePrecoService,
    private readonly contextService: ContextService
  ) {}

  async upsert(dto: ImportPrecoDto[]): Promise<PrecoReferenciaView[]> {
    const operadorId = this.contextService.operadorId();

    const precos = dto.map((x) => ({ ...x, operadorId }));

    await this.repository.upsert(precos, { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] });

    return this.view.find({
      where: { tabelaDePrecoId: In(dto.map((x) => x.tabelaDePrecoId)), referenciaId: In(dto.map((x) => x.referenciaId)) },
    });
  }

  async add(tabelaDePrecoId: number, { referenciaId, preco }: AddPrecoReferenciaDto): Promise<PrecoReferenciaView> {
    const operadorId = this.contextService.currentUser().id;
    const { terminador } = await this.tabelaService.findById(tabelaDePrecoId);

    await this.repository.upsert(
      { tabelaDePrecoId, referenciaId, preco: Math.floor(preco) + (terminador % 1), operadorId },
      { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] }
    );

    return this.findByReferenciaId(tabelaDePrecoId, referenciaId);
  }

  async find(
    tabelaDePrecoId: number,
    { referenciaIds, referenciaIdExternos, page, limit }: FindOptions
  ): Promise<Pagination<PrecoReferenciaView>> {
    const queryBuilder = this.view.createQueryBuilder('p');
    queryBuilder.where({ tabelaDePrecoId });

    if (referenciaIds && referenciaIds.length > 0) {
      queryBuilder.andWhere({ referenciaId: In(referenciaIds) });
    }
    if (referenciaIdExternos && referenciaIdExternos.length > 0) {
      queryBuilder.andWhere({ referenciaIdExterno: In(referenciaIdExternos) });
    }

    return paginate<PrecoReferenciaView>(queryBuilder, { page: page ?? 1, limit: limit ?? 100 });
  }

  async findByReferenciaId(tabelaDePrecoId: number, referenciaId: number): Promise<PrecoReferenciaView> {
    return this.view.findOne({ where: { tabelaDePrecoId, referenciaId } });
  }
}
