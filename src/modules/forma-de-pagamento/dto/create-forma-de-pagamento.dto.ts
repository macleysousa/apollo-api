import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';

export class CreateFormaDePagamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 50)
  descricao: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  inicio?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parcelas?: number;

  @ApiProperty({ enum: TipoDocumento })
  @IsNotEmpty()
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;
}
