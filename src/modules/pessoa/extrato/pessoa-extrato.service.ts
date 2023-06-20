import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Not, IsNull } from 'typeorm';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { TipoDocumento } from './enum/tipo-documento.enum';

interface filter {
  empresaIds?: number[];
  pessoaId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  tipoDocumento?: [TipoDocumento];
}

@Injectable()
export class PessoaExtratoService {
  constructor(
    @InjectRepository(PessoaExtratoEntity)
    private repository: Repository<PessoaExtratoEntity>
  ) {}

  async find(filter?: filter): Promise<PessoaExtratoEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('p');
    queryBuilder.where({ empresaId: Not(IsNull()) });

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere({ empresaId: In(filter.empresaIds) });
    }

    if (filter?.tipoDocumento && filter.tipoDocumento.length > 0) {
      queryBuilder.andWhere({ tipoDocumento: In(filter.tipoDocumento) });
    }

    if (filter?.pessoaId) {
      queryBuilder.andWhere({ pessoaId: filter.pessoaId });
    }

    if (filter?.dataInicio) {
      queryBuilder.andWhere('p.data >= :dataInicio', { dataInicio: filter.dataInicio });
    }

    if (filter?.dataFim) {
      queryBuilder.andWhere('p.data <= :dataFim', { dataFim: filter.dataFim });
    }

    return queryBuilder.getMany();
  }
}
