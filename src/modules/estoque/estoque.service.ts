import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EstoqueEntity } from './entities/estoque.entity';

@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(EstoqueEntity)
    private repository: Repository<EstoqueEntity>
  ) {}
}
