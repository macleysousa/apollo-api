import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaEntity } from './entities/empresa.entity';
import { EmpresaFilter } from './filters/empresa-filter';
import { EmpresaInclude } from './includes/empresa.include';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private repository: Repository<EmpresaEntity>,
  ) {}

  async create(createBranchDto: CreateEmpresaDto): Promise<EmpresaEntity> {
    const branch = await this.repository.save({
      ...createBranchDto,
      data: new Date(),
    });

    return this.findById(branch.id);
  }

  async find(filter?: EmpresaFilter): Promise<EmpresaEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('e');

    if (filter?.searchTerm) {
      queryBuilder.where('e.cnpj ILIKE :searchTerm OR e.nome ILIKE :searchTerm', {
        searchTerm: `%${filter.searchTerm}%`,
      });
    }

    if (filter?.ids && filter.ids.length > 0) {
      queryBuilder.andWhere('e.id IN (:...ids)', { ids: filter.ids });
    }

    if (filter?.incluir && filter.incluir.length > 0) {
      filter.incluir.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`e.${relation}`, relation);
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: number, relations?: EmpresaInclude[]): Promise<EmpresaEntity> {
    return this.repository.findOne({ where: { id }, relations });
  }

  async update(id: number, updateBranchDto: UpdateEmpresaDto): Promise<EmpresaEntity> {
    await this.repository.update(id, updateBranchDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
