import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { LancarMovimento } from './dto/lancar-movimento.dto';
import { ContextService } from 'src/context/context.service';
import { TipoHistorico } from './enum/tipo-historico.enum';

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

  async cancelarLiquidacao(empresaId: number, caixaId: number, liquidacao: number, motivo: string): Promise<void> {
    const liquidacaoRows = await this.findByLiquidacao(empresaId, caixaId, liquidacao);

    const historicosCancelaves = [TipoHistorico.Adiantamento, TipoHistorico.Suprimento, TipoHistorico.Sangria];
    liquidacaoRows.map((item) => {
      if (item.cancelado) {
        throw new BadRequestException(`A liquidação ${liquidacao} já foi cancelada`);
      } else if (!historicosCancelaves.includes(item.tipoHistorico)) {
        throw new BadRequestException(`O tipo de liquidação ${item.tipoHistorico} não pode ser cancelado`);
      }
    });

    await this.repository.update({ empresaId, caixaId, liquidacao }, { cancelado: true, motivoCancelamento: motivo });
  }
}
