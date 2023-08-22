import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Not, IsNull } from 'typeorm';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { TipoDocumento } from './enum/tipo-documento.enum';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { ContextService } from 'src/context/context.service';

interface dto {
  pessoaId: number;
  tipoDocumento: TipoDocumento;
  tipoMovimento: TipoMovimento;
  valor: number;
  observacao: string;
}

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

  async lancarMovimento(dto: dto): Promise<PessoaExtratoEntity> {
    return this.repository.save({
      pessoaId: dto.pessoaId,
      tipoDocumento: dto.tipoDocumento,
      tipoMovimento: dto.tipoMovimento,
      valor: dto.valor,
      observacao: dto.observacao,
    } as any);
  }

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

  async findSaldoAdiantamento(empresaId: number, pessoaId: number): Promise<number> {
    const extrato = await this.repository.find({
      where: { empresaId, pessoaId, tipoDocumento: TipoDocumento.Adiantamento, cancelado: false },
    });

    return extrato.sum((x) => x.valor);
  }

  async findSaldoCreditoDeDevolucao(empresaId: number, pessoaId: number): Promise<number> {
    const extrato = await this.repository.find({
      where: { empresaId, pessoaId, tipoDocumento: TipoDocumento.Credito_de_Devolucao, cancelado: false },
    });

    return extrato.sum((x) => x.valor);
  }
}
