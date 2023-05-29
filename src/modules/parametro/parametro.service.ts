import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { ParametroEntity } from './entities/parametro.entity';

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
    ];
    await this.repository.save(parametros);
  }

  async find(id?: string, descricao?: string): Promise<ParametroEntity[]> {
    return this.repository.find({ where: { id: ILike(`%${id ?? ''}%`), descricao: ILike(`%${descricao ?? ''}%`) } });
  }

  async findById(id: string): Promise<ParametroEntity> {
    return this.repository.findOne({ where: { id } });
  }
}
