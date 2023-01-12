/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class PaginationMetaDTO {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class PaginatedDTO<TData> {
  @ApiProperty()
  readonly meta: PaginationMetaDTO;

  @ApiProperty({ isArray: true })
  @IsArray()
  readonly items: TData[];
}
