import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { ContextService } from 'src/context/context.service';

import { CaixaEntity } from '../entities/caixa.entity';
import { CaixaSituacao } from '../enum/caixa-situacao.enum';
import { CaixaExtratoEntity } from '../extrato/entities/extrato.entity';

import { CreateCaixaContagemDto } from './dto/create-contagem.dto';
import { CaixaContagemEntity } from './entities/contagem.entity';
import { CaixaContagemItemEntity } from './entities/contagem-item.entity';

@Injectable()
export class CaixaContagemService {
  constructor(
    @InjectRepository(CaixaContagemEntity)
    private readonly repository: Repository<CaixaContagemEntity>,
    @InjectRepository(CaixaContagemItemEntity)
    private readonly itemRepository: Repository<CaixaContagemItemEntity>,
    private readonly contextService: ContextService,
  ) {}

  private async sumExtratoByTipo(tipo: TipoDocumento, empresaId: number, caixaId: number) {
    const manager = this.repository.manager;

    const qb = manager
      .createQueryBuilder(CaixaExtratoEntity, 'e')
      .select('COALESCE(SUM(e.valor),0)', 'sum')
      .where('e.empresaId = :empresaId', { empresaId })
      .andWhere('e.caixaId = :caixaId', { caixaId })
      .andWhere('e.tipoDocumento = :tipoDocumento', { tipoDocumento: tipo })
      .andWhere('e.cancelado = false');

    const raw = await qb.getRawOne();
    return parseFloat(raw.sum) || 0;
  }

  async create(caixaId: number, dto: CreateCaixaContagemDto) {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    // Verificar se já existe contagem para este caixa (1:1)
    const existing = await this.repository.findOne({ where: { empresaId: empresa.id, data: empresa.data, caixaId } });
    if (existing) {
      throw new BadRequestException('Já existe uma contagem registrada para este caixa');
    }

    const autoTypes = [TipoDocumento.Voucher, TipoDocumento.Adiantamento, TipoDocumento.Credito_de_Devolucao];
    const computed: Record<string, number> = {};
    for (const t of autoTypes) {
      computed[t] = await this.sumExtratoByTipo(t, empresa.id, caixaId);
    }

    // Efetuar operação em transação: criar contagem, inserir itens e marcar caixa em situação de contagem
    await this.repository.manager.transaction(async (manager) => {
      const contagemRepo = manager.getRepository(CaixaContagemEntity);
      const itemRepo = manager.getRepository(CaixaContagemItemEntity);
      const caixaRepo = manager.getRepository(CaixaEntity);

      const caixa = await caixaRepo.findOne({ where: { empresaId: empresa.id, id: caixaId } });
      if (!caixa) {
        throw new BadRequestException('Caixa não encontrado');
      }

      if (caixa.situacao === CaixaSituacao.fechado) {
        throw new BadRequestException('Não é possível registrar contagem em caixa fechado');
      }

      const contagem = await contagemRepo.save({
        empresaId: empresa.id,
        data: empresa.data,
        caixaId,
        operadorId,
        observacao: dto.observacao,
      });

      const itemsToInsert = dto.items.map((item) => {
        const valor = item.valor != null ? item.valor : (computed[item.tipoDocumento] ?? 0);
        return {
          empresaId: empresa.id,
          data: empresa.data,
          caixaId,
          contagemId: contagem.id,
          tipoDocumento: item.tipoDocumento,
          valor,
        };
      });

      await itemRepo.insert(itemsToInsert);

      // Atualizar situação do caixa para 'contagem'
      await caixaRepo.update({ empresaId: empresa.id, id: caixaId }, { situacao: CaixaSituacao['contagem'] });

      await itemRepo.find({ where: { empresaId: empresa.id, caixaId, contagemId: contagem.id } });
    });

    return this.find(empresa.id, caixaId);
  }

  async find(empresaId: number, caixaId: number): Promise<CaixaContagemEntity> {
    return this.repository.findOne({ where: { empresaId, caixaId }, relations: ['items'] });
  }

  async update(caixaId: number, dto: CreateCaixaContagemDto) {
    const empresa = this.contextService.empresa();

    const existing = await this.repository.findOne({ where: { empresaId: empresa.id, caixaId } });
    if (!existing) {
      throw new BadRequestException('Contagem não encontrada para este caixa');
    }

    const caixaRepo = this.repository.manager.getRepository(CaixaEntity);
    const caixa = await caixaRepo.findOne({ where: { empresaId: empresa.id, id: caixaId } });
    if (!caixa) throw new BadRequestException('Caixa não encontrado');
    if (caixa.situacao === CaixaSituacao.fechado) {
      throw new BadRequestException('Não é possível atualizar contagem de caixa fechado');
    }

    const autoTypes = [TipoDocumento.Voucher, TipoDocumento.Adiantamento, TipoDocumento.Credito_de_Devolucao];
    const computed: Record<string, number> = {};
    for (const t of autoTypes) {
      computed[t] = await this.sumExtratoByTipo(t, empresa.id, caixaId);
    }

    await this.repository.manager.transaction(async (manager) => {
      const contagemRepo = manager.getRepository(CaixaContagemEntity);
      const itemRepo = manager.getRepository(CaixaContagemItemEntity);

      await contagemRepo.update({ empresaId: empresa.id, caixaId, id: existing.id }, { observacao: dto.observacao });

      const itemsToUpsert = dto.items.map((item) => {
        const valor = item.valor != null ? item.valor : (computed[item.tipoDocumento] ?? 0);
        return {
          empresaId: empresa.id,
          data: empresa.data,
          caixaId,
          contagemId: existing.id,
          tipoDocumento: item.tipoDocumento,
          valor,
        };
      });

      await itemRepo.upsert(itemsToUpsert, ['empresaId', 'caixaId', 'contagemId', 'tipoDocumento']);
    });

    await this.repository.findOne({ where: { empresaId: empresa.id, caixaId, id: existing.id } });
    await this.itemRepository.find({ where: { empresaId: empresa.id, caixaId, contagemId: existing.id } });

    return this.find(empresa.id, caixaId);
  }

  @Transactional()
  async remove(caixaId: number) {
    const empresa = this.contextService.empresa();
    const manager = this.repository.manager;

    const existing = await this.repository.findOne({ where: { empresaId: empresa.id, caixaId } });
    if (!existing) {
      throw new BadRequestException('Contagem não encontrada para este caixa');
    }

    const caixaRepo = manager.getRepository(CaixaEntity);
    const caixa = await caixaRepo.findOne({ where: { empresaId: empresa.id, id: caixaId } });
    if (!caixa) throw new BadRequestException('Caixa não encontrado');

    if (caixa.situacao === CaixaSituacao.fechado) {
      throw new BadRequestException('Não é possível excluir contagem de caixa fechado');
    }

    await this.repository.delete({ empresaId: empresa.id, caixaId, id: existing.id });

    // Reverter situação do caixa para aberto
    await caixaRepo.update({ empresaId: empresa.id, id: caixaId }, { situacao: CaixaSituacao.aberto });

    return { ok: true };
  }

  @Transactional()
  async encerrar(caixaId: number) {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const contagem = await this.repository.findOne({ where: { empresaId: empresa.id, caixaId } });
    if (!contagem) {
      throw new BadRequestException('Contagem não encontrada para este caixa');
    }

    const items = await this.itemRepository.find({ where: { empresaId: empresa.id, caixaId, contagemId: contagem.id } });
    if (!items || items.length === 0) {
      throw new BadRequestException('Contagem não possui itens');
    }

    const contagemTotals: Record<string, number> = {};
    items.forEach((it) => {
      contagemTotals[it.tipoDocumento] = (contagemTotals[it.tipoDocumento] ?? 0) + (Number(it.valor) || 0);
    });

    const autoTypes = [TipoDocumento.Voucher, TipoDocumento.Adiantamento, TipoDocumento.Credito_de_Devolucao];
    const typesToCheck = new Set<string>([...Object.values(TipoDocumento), ...Object.keys(contagemTotals), ...autoTypes]);

    const divergences: Array<{ tipo: string; contagem: number; extrato: number }> = [];
    const epsilon = 0.0001;

    for (const t of Array.from(typesToCheck)) {
      const extratoVal = await this.sumExtratoByTipo(t as TipoDocumento, empresa.id, caixaId);
      const contVal = contagemTotals[t] ?? 0;
      if (Math.abs(contVal - extratoVal) > epsilon) {
        divergences.push({ tipo: t, contagem: contVal, extrato: extratoVal });
      }
    }

    if (divergences.length > 0) {
      const msgs = divergences.map((d) => `${d.tipo}: contagem=${d.contagem.toFixed(4)}, extrato=${d.extrato.toFixed(4)}`);
      throw new BadRequestException(`Divergências encontradas: ${msgs.join('; ')}`);
    }

    // Sem divergências: fechar o caixa. Usar valorFechamento como total em dinheiro contado.
    const valorFechamento = contagemTotals[TipoDocumento.Dinheiro] ?? 0;

    const caixaRepo = this.repository.manager.getRepository(CaixaEntity);
    await caixaRepo.update(
      { empresaId: empresa.id, id: caixaId },
      { valorFechamento, operadorFechamentoId: operadorId, situacao: CaixaSituacao.fechado },
    );

    return { ok: true, message: 'Contagem encerrada e caixa fechado com sucesso' };
  }
}
