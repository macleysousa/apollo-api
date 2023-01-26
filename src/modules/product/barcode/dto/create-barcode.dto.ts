import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBarcodeDto {
  @ApiProperty()
  @IsNotEmpty()
  barcode: string;
}
