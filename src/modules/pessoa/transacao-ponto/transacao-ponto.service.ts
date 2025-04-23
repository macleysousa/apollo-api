import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CancelTransacaoPontoDto } from './dto/cancel-transacao-ponto.dto';
import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';

@Injectable()
export class TransacaoPontoService {
  constructor(
    @InjectRepository(TransacaoPontoEntity)
    private readonly repository: Repository<TransacaoPontoEntity>,
    private readonly context: ContextService,
  ) {}

  async create(pessoaId: number, dto: CreateTransacaoPontoDto): Promise<TransacaoPontoEntity> {
    var transacao = this.repository.create({ ...dto, pessoaId, empresaId: this.context.empresaId() });
    return this.repository.save(transacao).catch((error) => {
      throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao criar transação de ponto');
    });
  }

  async find(pessoaId: number, filter: TransacaoPontoFilter): Promise<TransacaoPontoEntity[]> {
    const querBuilder = this.repository.createQueryBuilder('t');
    querBuilder.where('t.pessoaId = :pessoaId', { pessoaId });

    const empresaIds = [this.context.empresaId(), ...(filter?.empresaIds || [])];

    if (empresaIds) {
      querBuilder.andWhere('t.empresaId IN (:...empresaIds)', { empresaIds: empresaIds });
    }

    if (filter?.ids) {
      querBuilder.andWhere('t.id IN (:...ids)', { ids: filter.ids });
    }

    if (filter?.tipos) {
      querBuilder.andWhere('t.tipo IN (:...tipos)', { tipos: filter.tipos });
    }

    if (filter?.dataTransacaoInicio) {
      querBuilder.andWhere('t.dataTransacao >= :dataTransacaoInicio', { dataTransacaoInicio: filter.dataTransacaoInicio });
    }

    if (filter?.dataTransacaoFim) {
      querBuilder.andWhere('t.dataTransacao <= :dataTransacaoFim', { dataTransacaoFim: filter.dataTransacaoFim });
    }

    return querBuilder.orderBy('t.dataTransacao', 'DESC').getMany();
  }

  async findById(pessoaId: number, id: number): Promise<TransacaoPontoEntity> {
    return this.find(pessoaId, { ids: [id] })
      .then((transacoes) => transacoes.first())
      .catch((error) => {
        throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao buscar transação de ponto');
      });
  }

  async cancel(pessoaId: number, id: number, dto: CancelTransacaoPontoDto): Promise<TransacaoPontoEntity> {
    await this.repository
      .update(
        { id, pessoaId, empresaId: this.context.empresaId() },
        { cancelado: true, motivoCancelamento: dto.motivoCancelamento },
      )
      .catch((error) => {
        throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao cancelar transação de ponto');
      });

    return this.findById(pessoaId, id);
  }
}
