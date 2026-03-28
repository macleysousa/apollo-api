import { SelectQueryBuilder } from 'typeorm';

import { Pagination } from './dto/paginated.dto';

export interface PaginatedOptions {
  page: number;
  limit: number;
  sort?: 'ASC' | 'DESC';
}

export async function paginate<T>(queryBuilder: SelectQueryBuilder<T>, options: PaginatedOptions): Promise<Pagination<T>> {
  const { page = 1, limit = 25, sort = 'ASC' } = options;

  // Validar se existe uma ordenação aplicada, se não houver, aplicar uma ordenação padrão
  const orderBys = queryBuilder.expressionMap.orderBys;
  if (Object.keys(orderBys).length === 0) {
    // Validar se a entidade possui uma coluna 'id' para ordenação
    const mainAlias = queryBuilder.expressionMap.mainAlias;
    if (mainAlias && mainAlias.metadata.findColumnWithPropertyName('id')) {
      queryBuilder.orderBy(`${mainAlias.name}.id`, sort);
    }
  }

  queryBuilder.skip((page - 1) * limit).take(limit);

  const [items, total_items] = await queryBuilder.getManyAndCount();

  const item_count = items.length;
  const total_pages = Math.ceil(total_items / limit);
  const current_page = page;
  const has_next_page = current_page < total_pages;

  return {
    meta: {
      total_items,
      item_count,
      items_per_page: limit,
      total_pages,
      current_page,
      has_next_page,
    },
    items,
  };
}
