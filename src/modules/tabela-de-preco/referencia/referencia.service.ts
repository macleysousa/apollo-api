import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { TabelaDePrecoService } from '../tabela-de-preco.service';
import { ReferenciaEntity } from '../../referencia/entities/referencia.entity';

import { AddPrecoReferenciaDto } from './dto/add-referencia.dto';
import { ImportPrecoDto } from './dto/import-precos.dto';
import { UpdatePrecoReferenciaDto } from './dto/update-referencia.dto';
import { PrecoReferencia } from './entities/referencia.entity';
import { PrecoReferenciaView } from './views/referencia.view';

interface FindOptions {
  referenciaIds?: number[];
  referenciaIdExternos?: string[];
  page?: number;
  limit?: number;
}

interface FindNaoAssociadasOptions {
  nome?: string;
  idExterno?: string;
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
    @InjectRepository(ReferenciaEntity)
    private readonly referenciaRepository: Repository<ReferenciaEntity>,
    private readonly tabelaService: TabelaDePrecoService,
    private readonly contextService: ContextService,
  ) {}

  async upsert(dto: ImportPrecoDto[]): Promise<PrecoReferenciaView[]> {
    const operadorId = this.contextService.operadorId();

    const precos = await Promise.all(
      dto.map(async (x) => {
        const tabela = await this.tabelaService.findById(x.tabelaDePrecoId);
        const valorComTerminador = tabela?.terminador == null ? x.valor : Math.floor(x.valor) + (tabela.terminador % 1);

        return { ...x, valor: valorComTerminador, operadorId };
      }),
    );

    await this.repository.upsert(precos, { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] });

    return this.view.find({
      where: { tabelaDePrecoId: In(dto.map((x) => x.tabelaDePrecoId)), referenciaId: In(dto.map((x) => x.referenciaId)) },
    });
  }

  async add(tabelaDePrecoId: number, { referenciaId, valor }: AddPrecoReferenciaDto): Promise<PrecoReferenciaView> {
    const operadorId = this.contextService.usuario().id;
    const { terminador } = await this.tabelaService.findById(tabelaDePrecoId);
    const valorComTerminador = terminador == null ? valor : Math.floor(valor) + (terminador % 1);

    await this.repository.upsert(
      { tabelaDePrecoId, referenciaId, valor: valorComTerminador, operadorId },
      { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] },
    );

    return this.findByReferenciaId(tabelaDePrecoId, referenciaId);
  }

  async find(
    tabelaDePrecoId: number,
    { referenciaIds, referenciaIdExternos, page, limit }: FindOptions,
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

  async update(
    tabelaDePrecoId: number,
    referenciaId: number,
    { valor }: UpdatePrecoReferenciaDto,
  ): Promise<PrecoReferenciaView> {
    const preco = await this.findByReferenciaId(tabelaDePrecoId, referenciaId);
    if (!preco) {
      throw new BadRequestException('Preço da referência não encontrado nesta tabela');
    }

    const operadorId = this.contextService.usuario().id;
    const { terminador } = await this.tabelaService.findById(tabelaDePrecoId);
    const valorComTerminador = terminador == null ? valor : Math.floor(valor) + (terminador % 1);

    await this.repository.save({
      tabelaDePrecoId,
      referenciaId,
      valor: valorComTerminador,
      operadorId,
    });

    return this.findByReferenciaId(tabelaDePrecoId, referenciaId);
  }

  async remove(tabelaDePrecoId: number, referenciaId: number): Promise<void> {
    await this.repository.delete({ tabelaDePrecoId, referenciaId });
  }

  async findNaoAssociadas(
    tabelaDePrecoId: number,
    { nome, idExterno, page, limit }: FindNaoAssociadasOptions,
  ): Promise<Pagination<ReferenciaEntity>> {
    const queryBuilder = this.referenciaRepository.createQueryBuilder('r');

    queryBuilder.where(
      `NOT EXISTS (
        SELECT 1
        FROM tabelas_de_precos_referencias tpr
        WHERE tpr.tabelaDePrecoId = :tabelaDePrecoId
          AND tpr.referenciaId = r.id
      )`,
      { tabelaDePrecoId },
    );

    if (nome) {
      queryBuilder.andWhere('LOWER(r.nome) LIKE :nome', { nome: `%${nome.toLowerCase()}%` });
    }

    if (idExterno) {
      queryBuilder.andWhere('LOWER(r.idExterno) LIKE :idExterno', { idExterno: `%${idExterno.toLowerCase()}%` });
    }

    queryBuilder.orderBy('r.nome', 'ASC');

    return paginate<ReferenciaEntity>(queryBuilder, { page: page ?? 1, limit: limit ?? 100 });
  }
}
