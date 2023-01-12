import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateComponentGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
