import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CancelarSuprimentoDto {
  @ApiProperty({ description: 'Motivo do cancelamento do suprimento', example: 'Lançamento feito por engano' })
  @IsNotEmpty({ message: 'O campo "motivo" é obrigatório' })
  @MinLength(3, { message: 'O motivo deve ter no mínimo 3 caracteres' })
  motivo: string;

  constructor(partial?: Partial<CancelarSuprimentoDto>) {
    Object.assign(this, partial);
  }
}
