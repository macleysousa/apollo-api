import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaEntity } from './entities/empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private repository: Repository<EmpresaEntity>
  ) {}

  async create(createBranchDto: CreateEmpresaDto): Promise<EmpresaEntity> {
    const branch = await this.repository.save({
      ...createBranchDto,
      data: new Date(),
    });

    return this.findById(branch.id);
  }

  /** filter by cnpj or name */
  async find(filter?: string): Promise<EmpresaEntity[]> {
    return this.repository.find({
      where: {
        cnpj: ILike(`%${filter ?? ''}%`),
        nome: ILike(`%${filter ?? ''}%`),
      },
    });
  }

  async findById(id: number): Promise<EmpresaEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateBranchDto: UpdateEmpresaDto): Promise<EmpresaEntity> {
    await this.repository.update(id, updateBranchDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
