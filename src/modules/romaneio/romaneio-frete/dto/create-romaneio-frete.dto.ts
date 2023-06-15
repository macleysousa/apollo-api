import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { FreteTipo } from '../enum/frete-tipo';

export class CreateRomaneioFreteDto {
  @ApiProperty({ enum: FreteTipo, description: 'CIF: Frete por conta do remetente <br> FOB: Frete por conta do destinatário' })
  @IsNotEmpty()
  @IsEnum(FreteTipo)
  tipo: FreteTipo;

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
