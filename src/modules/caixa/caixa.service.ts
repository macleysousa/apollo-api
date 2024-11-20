import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';
import { CaixaSituacao } from './enum/caixa-situacao.enum';

@Injectable()
export class CaixaService {
  constructor(
    @InjectRepository(CaixaEntity)
    private readonly repository: Repository<CaixaEntity>,
    private readonly contextService: ContextService,
  ) {}

  async open({ empresaId, terminalId }: CreateCaixaDto): Promise<CaixaEntity> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();
    const ultimoCaixa = await this.repository.findOne({ where: { empresaId, terminalId }, order: { id: 'DESC' } });

    if (ultimoCaixa?.situacao === CaixaSituacao.aberto) {
      throw new BadRequestException('Já existe um caixa aberto para este terminal.');
    }

    const data = empresa.data;
    const operadorAberturaId = usuario.id;
    const valorAbertura = ultimoCaixa?.valorFechamento ?? 0;

    const caixa = await this.repository.save({ empresaId, data, valorAbertura, operadorAberturaId, terminalId });

    return this.findById(empresaId, caixa.id);
  }

  async findById(empresaId: number, id: number): Promise<CaixaEntity> {
    return this.repository.findOne({ where: { empresaId, id } });
  }
}
