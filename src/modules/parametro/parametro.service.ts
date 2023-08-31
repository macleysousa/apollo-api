import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { ParametroEntity } from './entities/parametro.entity';
import { Parametro } from './enum/parametros';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroEntity)
    private repository: Repository<ParametroEntity>
  ) {}

  async popular(): Promise<void> {
    const parametros: ParametroEntity[] = [
      { id: 'CD_PRECO_PADRAO', descricao: 'Tabela de preço padrão', valorPadrao: '0' },
      { id: 'QT_DIAS_TROCA', descricao: 'Quantidade de dias para troca', valorPadrao: '60' },
      { id: 'QT_DIAS_DEVOLUCAO', descricao: 'Quantidade de dias para devolução', valorPadrao: '7' },
      { id: 'OBS_PADRAO_COMPRA', descricao: 'Observação padrão para compra', valorPadrao: '' },
      { id: 'OBS_PADRAO_VENDA', descricao: 'Observação padrão para venda', valorPadrao: '' },
      { id: 'OBS_PADRAO_CONSIGNACAO', descricao: 'Observação padrão para consignação', valorPadrao: '' },
      { id: 'DEVOLVER_SEM_ROMANEIO', descricao: 'Devolver sem romaneio', valorPadrao: 'N' },
    ];
    await this.repository.save(parametros);
  }

  async find(id?: Parametro, descricao?: string): Promise<ParametroEntity[]> {
    return this.repository.find({ where: { id: ILike(`%${id ?? ''}%`) as any, descricao: ILike(`%${descricao ?? ''}%`) } });
  }

  async findById(id: Parametro): Promise<ParametroEntity> {
    return this.repository.findOne({ where: { id } });
  }
}
