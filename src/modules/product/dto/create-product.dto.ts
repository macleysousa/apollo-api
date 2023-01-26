import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  externalId: string;

  @ApiProperty()
  @IsOptional()
  unitMeasureId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  colorId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sizeId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  categoryId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  subCaregoryId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  referenceId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  brandId: number;
}
