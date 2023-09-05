import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class CancelPedidoDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(254, { message: 'Observação deve ter menos de 254 caracteres' })
  motivoCancelamento: string;
}
