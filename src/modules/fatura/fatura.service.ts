import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'class-validator';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In, IsNull, Not, Repository } from 'typeorm';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoInclusao } from 'src/commons/enum/tipo-inclusao';
import { ContextService } from 'src/context/context.service';

import { CreateFaturaAutimaticaDto } from './dto/create-fatura-automatica.dto';
import { CreateFaturaManualDto } from './dto/create-fatura-manual.dto';
import { UpdateFaturaManualDto } from './dto/update-fatura-manual.dto';
import { FaturaEntity } from './entities/fatura.entity';
import { FaturaSituacao } from './enum/fatura-situacao.enum';
import { Relations } from './relations/relations.type';
import { FaturaParcelaService } from './parcela/parcela.service';

interface filter {
  empresaIds: number[];
  faturaIds: number[];
  pessoaIds: number[];
  dataInicio: Date;
  dataFim: Date;
}

@Injectable()
export class FaturaService {
  constructor(
    @InjectRepository(FaturaEntity)
    private readonly repository: Repository<FaturaEntity>,
    private readonly parcelaService: FaturaParcelaService,
    private readonly contextService: ContextService
  ) {}

  async createManual(createFaturaDto: CreateFaturaManualDto): Promise<FaturaEntity> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    const fatura = await this.repository.save({
      ...createFaturaDto,
      empresaId: empresa.id,
      data: empresa.data,
      operadorId: usuario.id,
      tipoDocumento: TipoDocumento.Fatura,
      situacao: FaturaSituacao.Normal,
      tipoInclusao: TipoInclusao.Manual,
    });

    return this.findById(empresa.id, fatura.id);
  }

  async createAutomatica(createFaturaDto: CreateFaturaAutimaticaDto): Promise<FaturaEntity> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    const fatura = await this.repository.save({
      ...createFaturaDto,
      empresaId: empresa.id,
      data: empresa.data,
      operadorId: usuario.id,
      situacao: FaturaSituacao.Normal,
      tipoInclusao: TipoInclusao.Automatica,
    });

    if (createFaturaDto.itens && createFaturaDto.itens.length > 0) {
      await this.parcelaService.import(fatura.id, createFaturaDto.itens);
    }

    return this.findById(empresa.id, fatura.id, ['itens']);
  }

  async find(filter?: filter, page = 1, limit = 100, relations?: Relations[]): Promise<Pagination<FaturaEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('f');
    queryBuilder.where({ empresaId: Not(IsNull()) });
    queryBuilder.leftJoinAndSelect('f.pessoa', 'p');

    if (relations?.includes('itens')) {
      queryBuilder.leftJoinAndSelect('f.itens', 'i');
    }

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere({ empresaId: In(filter.empresaIds) });
    }

    if (filter?.faturaIds && filter.faturaIds.length > 0) {
      queryBuilder.andWhere({ id: In(filter.faturaIds) });
    }

    if (filter?.pessoaIds && filter.pessoaIds.length > 0) {
      queryBuilder.andWhere({ pessoaId: In(filter.pessoaIds) });
    }

    if (isDate(filter?.dataInicio)) {
      queryBuilder.andWhere('f.data >= :dataInicio', { dataInicio: filter.dataInicio });
    }

    if (isDate(filter?.dataFim)) {
      queryBuilder.andWhere('f.data <= :dataFim', { dataFim: filter.dataFim });
    }

    return paginate<FaturaEntity>(queryBuilder, { page, limit });
  }

  async findById(empresaId: number, id: number, relations?: Relations[]): Promise<FaturaEntity> {
    return this.repository.findOne({ where: { empresaId, id }, relations: relations });
  }

  async update(empresaId: number, id: number, updateFaturaDto: UpdateFaturaManualDto): Promise<FaturaEntity> {
    const usuario = this.contextService.usuario();
    const fatura = await this.findById(empresaId, id);
    if (!fatura) {
      throw new BadRequestException('Fatura não encontrada');
    } else if (fatura.situacao !== FaturaSituacao.Normal) {
      throw new BadRequestException('Não é possível atualizar uma fatura que não esteja com a situação "Normal"');
    }

    await this.repository.update({ empresaId, id, operadorId: usuario.id }, updateFaturaDto).catch(() => {
      throw new BadRequestException('Não foi possível atualizar a fatura');
    });

    return this.findById(empresaId, id);
  }

  async cancelar(empresaId: number, id: number): Promise<FaturaEntity> {
    const usuario = this.contextService.usuario();
    const fatura = await this.findById(empresaId, id);
    if (!fatura) {
      throw new BadRequestException('Fatura não encontrada');
    }

    await this.repository.update({ empresaId, id, operadorId: usuario.id }, { situacao: FaturaSituacao.Cancelada }).catch(() => {
      throw new BadRequestException('Não foi possível cancelar a fatura');
    });

    return this.findById(empresaId, id);
  }
}
