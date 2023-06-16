import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { FaturaSituacao } from '../enum/fatura-situacao.enum';
import { FaturaService } from '../fatura.service';
import { CancelarParcelaDto } from './dto/cancelar-parcela.dto';
import { ReceberParcelaDto } from './dto/receber-parcela.dto';
import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { ParcelaSituacao } from './enum/parcela-situacao.enum';

@Injectable()
export class FaturaParcelaService {
  constructor(
    @InjectRepository(FaturaParcelaEntity)
    private readonly repository: Repository<FaturaParcelaEntity>,
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
      throw new BadRequestException('Fatura não está aberta.');
    }

    const parcelas = await this.findByFaturaId(empresa.id, faturaId);
    const valorParcelas = parcelas
      .filter((x) => x.parcela != dto.parcela)
      .map((x) => x.valor)
      .reduce((a, b) => a + b, 0);

    if (valorParcelas + dto.valor > fatura.valor) {
      throw new BadRequestException(`Valor das parcelas não pode ultrapassar o valor da fatura ${fatura.valor}.`);
    }

    const parcela = await this.findByParcela(empresa.id, faturaId, dto.parcela);
    if (parcela?.situacao && parcela?.situacao !== ParcelaSituacao.Normal) {
      throw new BadRequestException('Parcela não está com situação "normal".');
    }

    await this.repository
      .upsert(
        { ...dto, empresaId: empresa.id, faturaId: faturaId, operadorId: usuario.id },
        { conflictPaths: ['empresaId', 'faturaId', 'parcela'] }
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível adicionar/alterar a parcela.');
      });

    return this.findByParcela(empresa.id, faturaId, dto.parcela);
  }

  async findByFaturaId(empresaId: number, faturaId: number): Promise<FaturaParcelaEntity[]> {
    return this.repository.find({ where: { empresaId, faturaId } });
  }

  async findByParcela(empresaId: number, faturaId: number, parcela: number): Promise<FaturaParcelaEntity> {
    return this.repository.findOne({ where: { empresaId, faturaId, parcela } });
  }

  async receber(empresaId: number, faturaId: number, { caixaId, parcela, valorDesconto }: ReceberParcelaDto): Promise<void> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const fatura = await this.faturaService.findById(empresaId, faturaId);
    if (!fatura) throw new BadRequestException('Fatura não encontrada.');

    const parcelaEntity = await this.findByParcela(empresa.id, faturaId, parcela);
    if (!parcelaEntity) throw new BadRequestException('Parcela não encontrada.');
    else if (parcelaEntity.situacao !== ParcelaSituacao.Normal) throw new BadRequestException('Parcela não está com situação "normal".');

    const valorPago = parcelaEntity.valor - valorDesconto;
    if (valorPago < 0) throw new BadRequestException('Valor do desconto maior que o valor da parcela.');

    const dto = {
      valorDesconto: valorDesconto,
      caixaPagamento: caixaId,
      valorPago: valorPago,
      pagamento: empresa.data,
      situacao: ParcelaSituacao.Paga,
      operadorId: usuario.id,
    };

    await this.repository.update({ empresaId, faturaId, parcela }, dto).catch(() => {
      throw new BadRequestException('Não foi possível receber a parcela.');
    });
  }

  async cancelar(empresaId: number, faturaId: number, { caixaId, parcela, motivo }: CancelarParcelaDto): Promise<void> {
    const usuario = this.contextService.currentUser();

    const fatura = await this.faturaService.findById(empresaId, faturaId);
    if (!fatura) throw new BadRequestException('Fatura não encontrada.');

    const parcelaEntity = await this.findByParcela(empresaId, faturaId, parcela);
    if (!parcelaEntity) throw new BadRequestException('Parcela não encontrada.');
    else if (parcelaEntity.situacao !== ParcelaSituacao.Paga) throw new BadRequestException('Parcela não está com situação "paga".');
    else if (parcelaEntity.caixaPagamento !== caixaId) throw new BadRequestException('Parcela não foi paga neste caixa.');

    await this.repository
      .update(
        { empresaId, faturaId, parcela },
        { situacao: ParcelaSituacao.Cancelada, observacao: `${parcelaEntity.observacao}\r${motivo}`.trim(), operadorId: usuario.id }
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível cancelar a parcela.');
      });
  }

  async remove(empresaId: number, faturaId: number, parcela: number): Promise<void> {
    const parcelaEntity = await this.findByParcela(empresaId, faturaId, parcela);
    if (!parcelaEntity) throw new BadRequestException('Parcela não encontrada.');
    else if (parcelaEntity.situacao !== ParcelaSituacao.Normal) throw new BadRequestException('Parcela não está com situação "normal".');

    await this.repository.delete({ empresaId, faturaId, parcela });
  }
}
