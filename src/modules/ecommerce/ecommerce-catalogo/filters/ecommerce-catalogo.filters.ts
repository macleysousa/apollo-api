import { OmitType } from '@nestjs/swagger';

import { EcommerceReferenciaFilters } from '../../ecommerce-referencia/filters/ecommerce-referencia.filters';

export class EcommerceCatalogoReferenciaFilter extends OmitType(EcommerceReferenciaFilters, ['ids', 'rascunho']) {}
