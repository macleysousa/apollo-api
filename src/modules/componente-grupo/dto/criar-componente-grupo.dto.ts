import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateComponenteGrupoDto {
  @ApiProperty()
  @IsNotEmpty()
  nome: string;
}
