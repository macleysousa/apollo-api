import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';

export class ContagemItemDto {
  @ApiProperty({ enum: TipoDocumento })
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O valor deve ser um número positivo' })
  valor: number;
}
