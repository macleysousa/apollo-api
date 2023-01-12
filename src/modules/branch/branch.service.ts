import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(BranchEntity)
    private branchRepository: Repository<BranchEntity>
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    const branch = await this.branchRepository.save(createBranchDto);

    return this.findById(branch.id);
  }

  /** filter by cnpj or name */
  async find(filter?: string): Promise<BranchEntity[]> {
    return this.branchRepository.find({
      where: {
        cnpj: ILike(`%${filter ?? ''}%`),
        name: ILike(`%${filter ?? ''}%`),
      },
    });
  }

  async findById(id: number): Promise<BranchEntity> {
    return this.branchRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<BranchEntity> {
    await this.branchRepository.update(id, updateBranchDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.branchRepository.delete(id);
  }
}
