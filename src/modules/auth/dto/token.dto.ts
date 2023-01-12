import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
