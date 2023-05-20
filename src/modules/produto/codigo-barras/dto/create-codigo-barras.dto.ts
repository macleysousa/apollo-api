import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCodigoBarrasDto {
  @ApiProperty()
  @IsNotEmpty()
  codigo: string;
}
