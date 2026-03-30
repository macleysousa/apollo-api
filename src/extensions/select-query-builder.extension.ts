import { SelectQueryBuilder } from 'typeorm';

import { paginate, PaginatedOptions } from '../commons/pagination';
import { Pagination } from '../commons/pagination/dto/paginated.dto';

// Extensão do SelectQueryBuilder
declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    paginate(options: PaginatedOptions): Promise<Pagination<Entity>>;
  }
}

// Implementação da extensão
SelectQueryBuilder.prototype.paginate = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  options: PaginatedOptions,
): Promise<Pagination<Entity>> {
  return paginate(this, options);
};
