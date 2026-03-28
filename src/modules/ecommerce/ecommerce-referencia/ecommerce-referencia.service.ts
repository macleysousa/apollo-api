import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pagination } from 'src/commons/pagination/dto/paginated.dto';
import { ContextService } from 'src/context/context.service';

import { CreateEcommerceReferenciaDto } from './dto/create-ecommerce-referencia.dto';
import { UpdateEcommerceReferenciaDto } from './dto/update-ecommerce-referencia.dto';
import { EcommerceReferenciaEntity } from './entities/ecommerce-referencia.entity';
import { EcommerceReferenciaFilters } from './filters/ecommerce-referencia.filters';
import { EcommerceReferenciaView } from './view/ecommerce-referencia.view';

@Injectable()
export class EcommerceReferenciaService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(EcommerceReferenciaEntity)
    private readonly repository: Repository<EcommerceReferenciaEntity>,
    @InjectRepository(EcommerceReferenciaView)
    private readonly viewRepository: Repository<EcommerceReferenciaView>,
  ) {}

  async create(dto: CreateEcommerceReferenciaDto): Promise<EcommerceReferenciaEntity> {
    const entity = this.repository.create({
      ...dto,
      empresaId: dto?.empresaId || this.contextService.empresaId(),
    });
    return this.repository.save(entity);
  }

  async findAll(filters: EcommerceReferenciaFilters): Promise<Pagination<EcommerceReferenciaView>> {
    const queryBuilder = this.viewRepository.createQueryBuilder('er');

    if (filters.ids) {
      queryBuilder.andWhere('er.id IN (:...ids)', { ids: filters.ids });
    }

    if (filters.empresaIds) {
      queryBuilder.andWhere('er.empresaId IN (:...empresaIds)', { empresaIds: filters.empresaIds });
    }

    if (filters.referenciaIds) {
      queryBuilder.andWhere('er.referenciaId IN (:...referenciaIds)', { referenciaIds: filters.referenciaIds });
    }

    if (filters.categoriaIds) {
      queryBuilder.andWhere('er.categoriaId IN (:...categoriaIds)', { categoriaIds: filters.categoriaIds });
    }

    if (filters.rascunho !== undefined) {
      queryBuilder.andWhere('er.rascunho = :rascunho', { rascunho: filters.rascunho });
    }

    if (filters.search) {
      queryBuilder.andWhere('er.nome LIKE :search', { search: `%${filters.search}%` });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 100;

    return queryBuilder.paginate({ page, limit });
  }

  async findEmpresa(empresaId: number, filters: EcommerceReferenciaFilters): Promise<Pagination<EcommerceReferenciaView>> {
    return this.findAll({ ...filters, empresaIds: [empresaId], rascunho: false });
  }

  async findOne(id: number): Promise<EcommerceReferenciaView> {
    return this.viewRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateEcommerceReferenciaDto): Promise<EcommerceReferenciaEntity> {
    await this.repository.update(id, dto);
    return this.repository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
