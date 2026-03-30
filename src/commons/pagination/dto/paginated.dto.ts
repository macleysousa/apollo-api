import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDTO {
  @ApiProperty()
  total_items: number;

  @ApiProperty()
  item_count: number;

  @ApiProperty()
  items_per_page: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  current_page: number;

  @ApiProperty()
  has_next_page: boolean;
}

export class Pagination<T> {
  @ApiProperty()
  meta: PaginationMetaDTO;

  @ApiProperty({ isArray: true, type: Object })
  readonly items: T[];
}
