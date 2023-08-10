import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCodigoBarrasDto {
  @Exclude()
  @IsOptional()
  produtoId?: number;

  @ApiProperty({ enum: ['EAN13', 'RFID'] })
  @IsNotEmpty({ message: 'O campo "tipo" é obrigatório' })
  @IsEnum(['EAN13', 'RFID'])
  tipo: 'EAN13' | 'RFID';

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "codigo" é obrigatório' })
  codigo: string;
}
