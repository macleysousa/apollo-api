import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

import { IsRomaneio } from 'src/commons/validations/is-romaneio.validation';

export class CancelarRomaneioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "romaneioId" é obrigatório' })
  @IsRomaneio()
  romaneioId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "motivo" é obrigatório' })
  @MinLength(3, { message: 'O motivo deve ter no mínimo 3 caracteres' })
  motivo: string;
}
