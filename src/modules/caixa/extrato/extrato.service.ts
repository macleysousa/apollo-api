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
    const queryBuilder = this.repository.createQueryBuilder().select(`FLOOR(UNIX_TIMESTAMP(NOW(3)) * 1000) AS timestamp`);
    const { timestamp } = await queryBuilder.getRawOne();
    return timestamp;
  }

  async lancarLiquidacao(caixaId: number, liquidacao: number, dto: LancarMovimento[]): Promise<CaixaExtratoEntity[]> {
    const operadorId = this.contextService.operadorId();
    const empresa = this.contextService.empresa();

    await this.repository.insert(
      dto.map((item) => ({
        ...item,
        empresaId: empresa.id,
        data: empresa.data,
        caixaId: caixaId,
        liquidacao: liquidacao,
        operadorId: operadorId,
      }))
    );

    return this.findByLiquidacao(empresa.id, caixaId, liquidacao);
  }

  async cancelarLiquidacao(empresaId: number, caixaId: number, liquidacao: number, motivoCancelamento: string): Promise<void> {
    const operadorId = this.contextService.operadorId();

    const liquidacaoRows = await this.findByLiquidacao(empresaId, caixaId, liquidacao);

    if (liquidacaoRows.first().tipoHistorico == TipoHistorico.Abertura_de_caixa) {
      throw new BadRequestException(`Não é possível cancelar liquidação de abertura de caixa`);
    } else if (liquidacaoRows.first().tipoHistorico == TipoHistorico.Fechamento_de_caixa) {
      throw new BadRequestException(`Não é possível cancelar liquidação de fechamento de caixa`);
    } else if (liquidacaoRows.first().cancelado) {
      throw new BadRequestException(`A liquidação ${liquidacao} já foi cancelada`);
    }

    await this.repository.update({ empresaId, caixaId, liquidacao }, { operadorId, motivoCancelamento, cancelado: true });
  }
}
