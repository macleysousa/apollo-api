import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        return this.branchRepository.save(createBranchDto);
    }

    async find(): Promise<BranchEntity[]> {
        return;
    }

    async findById(id: number): Promise<BranchEntity> {
        return;
    }

    async update(id: number, updateBranchDto: UpdateBranchDto): Promise<BranchEntity> {
        return;
    }

    async remove(id: number): Promise<void> {
        return;
    }
}
