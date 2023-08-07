import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReceberRomaneioDto {
  @ApiProperty()
  @IsNotEmpty()
  //@IsRomaneio()
  romaneioId: number;
}
