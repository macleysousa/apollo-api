import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelarBalancoLoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  motivo: string;
}
