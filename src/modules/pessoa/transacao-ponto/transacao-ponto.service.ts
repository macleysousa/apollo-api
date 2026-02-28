import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ContextService } from 'src/context/context.service';

import { PessoaEntity } from '../entities/pessoa.entity';

import { CancelTransacaoPontoDto } from './dto/cancel-transacao-ponto.dto';
import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { RedemptionTransacaoPontoDto } from './dto/redemption-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';
import { TransacaoPontoView } from './Views/transacao-ponto.view';

@Injectable()
export class TransacaoPontoService {
  constructor(
    @InjectRepository(TransacaoPontoEntity)
    private readonly repository: Repository<TransacaoPontoEntity>,
    @InjectRepository(TransacaoPontoView)
    private readonly viewRepository: Repository<TransacaoPontoView>,
    private readonly context: ContextService,
  ) {}

  async create(pessoaId: number, dto: CreateTransacaoPontoDto): Promise<TransacaoPontoView> {
    const pessoa = await this.repository.manager.findOne(PessoaEntity, { where: { id: pessoaId }, select: ['id', 'documento'] });

    var transacao = this.repository.create({
      ...dto,
      pessoaId,
      pessoaDocumento: pessoa.documento,
      tipo: 'Crédito',
      empresaId: this.context.empresaId(),
    });

    var save = await this.repository.save(transacao).catch((error) => {
      throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao criar transação de ponto');
    });

    return this.findById(pessoaId, save.id);
  }

  async find(pessoaId: number, filter: TransacaoPontoFilter): Promise<TransacaoPontoView[]> {
    const querBuilder = this.viewRepository.createQueryBuilder('t');
    querBuilder.where('t.pessoaId = :pessoaId', { pessoaId });

    const empresaIds = [...(filter?.empresaIds || [])];

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

    return querBuilder.orderBy('t.data', 'DESC').getMany();
  }

  async findById(pessoaId: number, id: number): Promise<TransacaoPontoView> {
    return this.find(pessoaId, { ids: [id] })
      .then((transacoes) => transacoes.first())
      .catch((error) => {
        throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao buscar transação de ponto');
      });
  }

  async cancel(pessoaId: number, id: number, dto: CancelTransacaoPontoDto): Promise<TransacaoPontoView> {
    await this.repository
      .update(
        { id, pessoaId, empresaId: this.context.empresaId() },
        { cancelada: true, motivoCancelamento: dto.motivoCancelamento },
      )
      .catch((error) => {
        throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao cancelar transação de ponto');
      });

    return this.findById(pessoaId, id);
  }

  @Transactional()
  async redemption(pessoaId: number, dto: RedemptionTransacaoPontoDto): Promise<void> {
    // Verifica pessoa tem saldo suficiente
    const saldo = await this.repository
      .query('SELECT fn_pessoa_saldo_pontos(?) as soldo', [pessoaId])
      .then((result) => Number(result[0].soldo ?? '0'));

    if (saldo < dto.quantidade)
      throw new BadRequestException(
        `Pessoa não possui pontos suficientes para executar esta operação. Pontos disponíveis: ${saldo.toFixed(2)}`,
      );

    // Obter transações validas
    var transacoes = await this.viewRepository.find({
      where: { empresaId: dto?.empresaId || undefined, pessoaId, tipo: 'Crédito', valida: true, saldo: MoreThan(0) },
    });

    // Calcular quantidade de pontos a serem resgatados por transação
    var quantidadeRestante = dto.quantidade;
    const resgates: Partial<TransacaoPontoEntity>[] = [];

    // FIFO: mais antigo primeiro
    for (const transacao of transacoes.orderBy((x) => x.id, 'asc')) {
      if (quantidadeRestante <= 0) break;

      const saldo = Number(transacao.saldo);

      if (saldo <= 0) continue;

      const pontosParaResgatar = Math.min(saldo, quantidadeRestante);

      resgates.push({
        empresaId: this.context.empresaId(),
        pessoaId: pessoaId,
        tipo: 'Débito',
        pessoaDocumento: transacao.pessoaDocumento,
        transacaoId: transacao.id,
        quantidade: pontosParaResgatar,
        observacao: dto.observacao ?? `Resgate de pontos referente à transação #${transacao.id}`,
      });

      quantidadeRestante -= pontosParaResgatar;
    }

    // Registrar resgates
    for (const resgate of resgates) {
      await this.repository.save(resgate).catch((error) => {
        throw new BadRequestException(error?.hint || error?.detail || error?.message || 'Erro ao registrar resgate de pontos');
      });

      const transacao = transacoes.find((t) => t.id === resgate.transacaoId);

      await this.repository
        .update({ id: transacao.id }, { resgatado: transacao.resgatado + resgate.quantidade })
        .catch((error) => {
          throw new BadRequestException(
            error?.hint || error?.detail || error?.message || 'Erro ao atualizar validade da transação de ponto',
          );
        });
    }
  }
}
