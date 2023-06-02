import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { AddEmpresaFormaPagamentoDto } from './dto/add-forma-de-pagamento.dto';
import { EmpresaFormaPagamentoEntity } from './entities/forma-de-pagamento.entity';

@Injectable()
export class EmpresaFormaPagamentoService {
  constructor(
    @InjectRepository(EmpresaFormaPagamentoEntity)
    private repository: Repository<EmpresaFormaPagamentoEntity>
  ) {}

  async add(empresaId: number, addFormaPagamentoDto: AddEmpresaFormaPagamentoDto): Promise<FormaDePagamentoEntity> {
    await this.repository.upsert({ ...addFormaPagamentoDto, empresaId }, { conflictPaths: ['empresaId', 'formaPagamentoId'] });

    return this.findByFormaPagamentoId(empresaId, addFormaPagamentoDto.formaPagamentoId);
  }

  async find(empresaId: number): Promise<FormaDePagamentoEntity[]> {
    const values = await this.repository.find({ where: { empresaId } });
    return values.map((value) => value.formaDePagamento);
  }

  async findByFormaPagamentoId(empresaId: number, formaPagamentoId: number): Promise<FormaDePagamentoEntity> {
    const value = await this.repository.findOne({ where: { empresaId, formaPagamentoId } });
    return value?.formaDePagamento;
  }

  async remove(empresaId: number, formaPagamentoId: number): Promise<void> {
    await this.repository.delete({ empresaId, formaPagamentoId });
  }
}
