import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateParametroDto {
  @ApiProperty()
  @IsNotEmpty()
  parametroId: string;

  @ApiProperty()
  @IsNotEmpty()
  valor: string;
}
