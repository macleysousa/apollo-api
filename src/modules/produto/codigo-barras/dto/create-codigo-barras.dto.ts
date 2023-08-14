import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { IsProduto } from 'src/commons/validations/is-produto.validation';

export class CreateCodigoBarrasDto {
  @Exclude()
  @IsOptional()
  @IsProduto()
  produtoId?: number;

  @ApiProperty({ enum: ['EAN13', 'RFID'] })
  @IsNotEmpty({ message: 'O campo "tipo" é obrigatório' })
  @IsEnum(['EAN13', 'RFID'])
  tipo: 'EAN13' | 'RFID';

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "codigo" é obrigatório' })
  codigo: string;
}
