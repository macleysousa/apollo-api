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

  async findByLiquidacao(empresaId: number, caixaId: number, liquidacao: number): Promise<CaixaExtratoEntity[]> {
    return this.repository.find({ where: { empresaId, caixaId, liquidacao } });
  }

  async newLiquidacaoId(): Promise<number> {
    const rows = await this.repository.query(`SELECT FLOOR(UNIX_TIMESTAMP(NOW(3)) * 1000) AS timestamp`);
    return rows[0].timestamp;
  }

  async lancarLiquidacao(caixaId: number, liquidacao: number, dto: LancarMovimento[]): Promise<CaixaExtratoEntity[]> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    await this.repository.insert(
      dto.map((item) => ({
        ...item,
        empresaId: empresa.id,
        data: empresa.data,
        caixaId: caixaId,
        liquidacao: liquidacao,
        operadorId: usuario.id,
      }))
    );

    return this.findByLiquidacao(empresa.id, caixaId, liquidacao);
  }
}
