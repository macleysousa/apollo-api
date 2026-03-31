import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { EcommerceEntity } from './entities/ecommerce.entity';

@Injectable()
export class EcommerceService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(EcommerceEntity)
    private readonly repository: Repository<EcommerceEntity>,
  ) {}
}
