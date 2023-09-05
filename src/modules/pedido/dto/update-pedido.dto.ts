import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';

export class UpdatePedidoDto extends PartialType(OmitType(CreatePedidoDto, ['tipo'])) {}
