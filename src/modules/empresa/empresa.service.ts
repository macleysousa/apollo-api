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
    private branchRepository: Repository<EmpresaEntity>
  ) {}

  async create(createBranchDto: CreateEmpresaDto): Promise<EmpresaEntity> {
    const branch = await this.branchRepository.save(createBranchDto);

    return this.findById(branch.id);
  }

  /** filter by cnpj or name */
  async find(filter?: string): Promise<EmpresaEntity[]> {
    return this.branchRepository.find({
      where: {
        cnpj: ILike(`%${filter ?? ''}%`),
        name: ILike(`%${filter ?? ''}%`),
      },
    });
  }

  async findById(id: number): Promise<EmpresaEntity> {
    return this.branchRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBranchDto: UpdateEmpresaDto): Promise<EmpresaEntity> {
    await this.branchRepository.update(id, updateBranchDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.branchRepository.delete(id);
  }
}
