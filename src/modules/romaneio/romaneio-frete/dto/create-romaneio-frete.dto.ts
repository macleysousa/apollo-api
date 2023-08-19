import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { TipoFrete } from '../../../../commons/enum/tipo-frete';

export class CreateRomaneioFreteDto {
  @ApiProperty({ enum: TipoFrete, description: 'CIF: Frete por conta do remetente <br> FOB: Frete por conta do destinatário' })
  @IsNotEmpty()
  @IsEnum(TipoFrete)
  tipo: TipoFrete;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  valor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  prazo: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(500)
  observacao: string;
}
