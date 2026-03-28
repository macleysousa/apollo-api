import { PartialType } from '@nestjs/swagger';
import { CreateEcommerceReferenciaDto } from './create-ecommerce-referencia.dto';

export class UpdateEcommerceReferenciaDto extends PartialType(CreateEcommerceReferenciaDto) {}
