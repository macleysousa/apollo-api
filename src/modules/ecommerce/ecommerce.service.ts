import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pagination } from 'src/commons/pagination/dto/paginated.dto';
import { ContextService } from 'src/context/context.service';

import { EcommerceReferenciaService } from './ecommerce-referencia/ecommerce-referencia.service';
import { EcommerceReferenciaView } from './ecommerce-referencia/view/ecommerce-referencia.view';
import { EcommerceEntity } from './entities/ecommerce.entity';

@Injectable()
export class EcommerceService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(EcommerceEntity)
    private readonly repository: Repository<EcommerceEntity>,
    private readonly ecommerceReferenciaService: EcommerceReferenciaService,
  ) {}

  async findReferenciasPublic(id: number): Promise<Pagination<EcommerceReferenciaView>> {
    return this.ecommerceReferenciaService.findAll(id, { rascunho: false });
  }
}
