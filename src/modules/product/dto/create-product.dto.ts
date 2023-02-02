import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsBrand } from 'src/commons/validations/is-brand.validation';
import { IsSubCategory } from 'src/commons/validations/is-category-sub.validation';
import { IsCategory } from 'src/commons/validations/is-category.validation';
import { IsColor } from 'src/commons/validations/is-color.validation';
import { IsMeasurementUnit } from 'src/commons/validations/is-measurement-unit.validation';
import { IsReference } from 'src/commons/validations/is-reference.validation';
import { IsSize } from 'src/commons/validations/is-size.validation';

export class CreateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  externalId?: string;

  @ApiProperty()
  @IsOptional()
  @IsMeasurementUnit()
  measurementUnitId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsColor()
  colorId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsSize()
  sizeId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsCategory()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsSubCategory()
  subCategoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsReference()
  referenceId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBrand()
  brandId?: number;
}
