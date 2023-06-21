import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { FaturaSituacao } from '../enum/fatura-situacao.enum';
import { FaturaService } from '../fatura.service';
import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { ParcelaSituacao } from './enum/parcela-situacao.enum';

@Injectable()
export class FaturaParcelaService {
  constructor(
    @InjectRepository(FaturaParcelaEntity)
    private readonly repository: Repository<FaturaParcelaEntity>,
    @Inject(forwardRef(() => FaturaService))
    private readonly faturaService: FaturaService,
    private readonly contextService: ContextService
  ) {}

  async add(faturaId: number, dto: UpsertParcelaDto): Promise<FaturaParcelaEntity> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const fatura = await this.faturaService.findById(empresa.id, faturaId);
    if (!fatura) {
      throw new BadRequestException('Fatura não encontrada.');
    } else if (fatura.situacao !== FaturaSituacao.Normal) {
      throw new BadRequestException(`Fatura ${faturaId} não está com situação "normal".`);
    }

    const parcelas = await this.findByFaturaId(empresa.id, faturaId);
    const valorParcelas = parcelas.filter((x) => x.parcela != dto.parcela).sum((x) => x.valor);

    if (valorParcelas + dto.valor > fatura.valor) {
      throw new BadRequestException(`Valor das parcelas não pode ultrapassar o valor da fatura ${fatura.valor}.`);
    }

    const parcela = await this.findByParcela(empresa.id, faturaId, dto.parcela);
    if (parcela?.situacao && parcela.situacao !== ParcelaSituacao.Normal) {
      throw new BadRequestException('Parcela não está com situação "normal".');
    }

    await this.repository
      .upsert(
        {
          ...dto,
          empresaId: empresa.id,
          faturaId: faturaId,
          vencimento: dto?.vencimento ?? empresa.data,
          operadorId: usuario.id,
        },
        { conflictPaths: ['empresaId', 'faturaId', 'parcela'] }
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível adicionar/alterar a parcela.');
      });

    return this.findByParcela(empresa.id, faturaId, dto.parcela);
  }

  async import(faturaId: number, parcelas: UpsertParcelaDto[]): Promise<FaturaParcelaEntity[]> {
    return Promise.all(parcelas.map((parcela) => this.add(faturaId, parcela)));
  }

  async findByFaturaId(empresaId: number, faturaId: number): Promise<FaturaParcelaEntity[]> {
    return this.repository.find({ where: { empresaId, faturaId } });
  }

  async findByParcela(empresaId: number, faturaId: number, parcela: number): Promise<FaturaParcelaEntity> {
    return this.repository.findOne({ where: { empresaId, faturaId, parcela } });
  }

  async remove(empresaId: number, faturaId: number, parcela: number): Promise<void> {
    const parcelaEntity = await this.findByParcela(empresaId, faturaId, parcela);
    if (!parcelaEntity) throw new BadRequestException('Parcela não encontrada.');
    else if (parcelaEntity.situacao !== ParcelaSituacao.Normal) throw new BadRequestException('Parcela não está com situação "normal".');

    await this.repository.delete({ empresaId, faturaId, parcela }).catch(() => {
      throw new BadRequestException('Não foi possível remover a parcela.');
    });
  }

  async receber(empresaId: number, caixaId: number, faturaId: number, parcela: number): Promise<void> {
    const usuario = this.contextService.currentUser();

    const parcelaEntity = await this.findByParcela(empresaId, faturaId, parcela);
    if (!parcelaEntity) throw new BadRequestException('Parcela não encontrada.');
    else if (parcelaEntity.situacao !== ParcelaSituacao.Normal) throw new BadRequestException('Parcela não está com situação "normal".');

    await this.repository
      .update(
        { empresaId, faturaId, parcela },
        {
          situacao: ParcelaSituacao.Paga,
          caixaPagamento: caixaId,
          operadorId: usuario.id,
          valorPago: parcelaEntity.valor - parcelaEntity.valorDesconto,
          pagamento: 'now()',
        }
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível receber a parcela.');
      });
  }
}
