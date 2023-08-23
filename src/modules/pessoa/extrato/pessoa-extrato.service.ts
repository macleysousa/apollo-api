import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Not, IsNull } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { TipoDocumento } from './enum/tipo-documento.enum';
import { LancarMovimentoPessoaDto } from './dto/lancar-movimento.dto';

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
    private repository: Repository<PessoaExtratoEntity>,
    private contextService: ContextService
  ) {}

  async lancarMovimento(dto: LancarMovimentoPessoaDto): Promise<PessoaExtratoEntity> {
    const operadorId = this.contextService.operadorId();
    const empresa = this.contextService.currentBranch();

    return this.repository.save({
      ...dto,
      empresaId: empresa.id,
      data: empresa.data,
      operadorId,
    });
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
