import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

import { AddPedidoItemDto } from './add-pedido-item.dto';

export class ConferirPedidoItemDto extends AddPedidoItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "sequencia" é obrigatório' })
  @Min(1, { message: 'O campo "sequencia" deve ser maior que zero' })
  @Max(999, { message: 'O campo "sequencia" deve ser menor que 1000' })
  @IsInt({ message: 'O campo "sequencia" deve ser um número inteiro' })
  sequencia: number;
}
