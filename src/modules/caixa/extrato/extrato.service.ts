import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { LancarMovimento } from './dto/lancar-movimento.dto';
import { ContextService } from 'src/context/context.service';

@Injectable()
export class CaixaExtratoService {
  constructor(
    @InjectRepository(CaixaExtratoEntity)
    private readonly repository: Repository<CaixaExtratoEntity>,
    private readonly contextService: ContextService
  ) {}

  async find(empresaId: number, caixaId: number): Promise<CaixaExtratoEntity[]> {
    return this.repository.find({ where: { empresaId, caixaId } });
  }

  async findByDocumento(empresaId: number, caixaId: number, documento: number): Promise<CaixaExtratoEntity> {
    return this.repository.findOne({ where: { empresaId, caixaId, documento } });
  }

  async lancarMovimento(caixaId: number, dto: LancarMovimento): Promise<CaixaExtratoEntity> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    const extrato = await this.repository.save({
      empresaId: empresa.id,
      data: empresa.data,
      caixaId: caixaId,
      tipoDocumento: dto.tipoDocumento,
      tipoHistorico: dto.tipoHistorico,
      tipoMovimento: dto.tipoMovimento,
      valor: dto.valor,
      faturaId: dto.faturaId,
      faturaParcela: dto.faturaParcela,
      observacao: dto.observacao,
      operadorId: usuario.id,
    });

    return this.findByDocumento(empresa.id, caixaId, extrato.documento);
  }
}
