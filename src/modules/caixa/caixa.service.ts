import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthRequest } from 'src/decorators/current-auth.decorator';

import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';
import { CaixaSituacao } from './enum/caixa-situacao.enum';

@Injectable()
export class CaixaService {
  constructor(
    @Inject('REQUEST')
    private request: AuthRequest,
    @InjectRepository(CaixaEntity)
    private repository: Repository<CaixaEntity>
  ) {}

  async open({ empresaId, terminalId }: CreateCaixaDto): Promise<CaixaEntity> {
    const ultimoCaixa = await this.repository.findOne({ where: { empresaId, terminalId }, order: { id: 'DESC' } });

    if (ultimoCaixa?.situacao === CaixaSituacao.Aberto) {
      throw new BadRequestException('Já existe um caixa aberto para este terminal.');
    }

    const operadorAberturaId = this.request.usuario.id;
    const valorAbertura = ultimoCaixa?.valorFechamento ?? 0;

    const caixa = await this.repository.save({ empresaId, valorAbertura, operadorAberturaId, terminalId });

    return this.findById(empresaId, caixa.id);
  }

  async findById(empresaId: number, id: number): Promise<CaixaEntity> {
    return this.repository.findOne({ where: { empresaId, id } });
  }
}
