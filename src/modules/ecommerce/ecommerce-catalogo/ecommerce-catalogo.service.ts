import { Injectable } from '@nestjs/common';

import { Pagination } from 'src/commons/pagination/dto/paginated.dto';

import { EcommerceReferenciaService } from '../ecommerce-referencia/ecommerce-referencia.service';
import { EcommerceReferenciaView } from '../ecommerce-referencia/view/ecommerce-referencia.view';

import { EcommerceCatalogoReferenciaFilter } from './filters/ecommerce-catalogo.filters';

@Injectable()
export class EcommerceCatalogoService {
  constructor(private readonly ecommerceReferenciaService: EcommerceReferenciaService) {}

  async findReferencias(
    ecommerceId: number,
    filter: EcommerceCatalogoReferenciaFilter,
  ): Promise<Pagination<EcommerceReferenciaView>> {
    return this.ecommerceReferenciaService.findAll(ecommerceId, { ...filter, rascunho: false });
  }
}
