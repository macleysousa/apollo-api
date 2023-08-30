import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CancelConsinacaoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo "motivoCancelamento" é obrigatório' })
  @MaxLength(254, { message: 'O campo "motivoCancelamento" deve ter no máximo 254 caracteres' })
  motivoCancelamento: string;
}
