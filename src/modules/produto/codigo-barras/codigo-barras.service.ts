import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';
import { CodigoBarrasEntity } from './entities/codigo-barras.entity';

@Injectable()
export class CodigoBarrasService {
  constructor(
    @InjectRepository(CodigoBarrasEntity)
    private repository: Repository<CodigoBarrasEntity>,
  ) {}

  async upsert(dto: CreateCodigoBarrasDto[]): Promise<CreateCodigoBarrasDto[]> {
    await this.repository.upsert(dto, { conflictPaths: ['produtoId', 'codigo'] });

    return this.repository.find({ where: { id: In(dto.map((x) => x.codigo)) } });
  }

  async create(produtoId: number, { codigo: code }: CreateCodigoBarrasDto): Promise<void> {
    await this.repository.upsert({ produtoId, codigo: code }, { conflictPaths: ['produtoId', 'codigo'] });
  }

  async remove(produtoId: number, codigo: string): Promise<void> {
    await this.repository.delete({ produtoId, codigo });
  }
}
