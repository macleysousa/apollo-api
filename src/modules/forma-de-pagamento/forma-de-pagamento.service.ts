import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateFormaDePagamentoDto } from './dto/create-forma-de-pagamento.dto';
import { UpdateFormaDePagamentoDto } from './dto/update-forma-de-pagamento.dto';
import { FormaDePagamentoEntity } from './entities/forma-de-pagamento.entity';

@Injectable()
export class FormaDePagamentoService {
  constructor(
    @InjectRepository(FormaDePagamentoEntity)
    private repository: Repository<FormaDePagamentoEntity>,
  ) {}

  async add(createFormaDePagamentoDto: CreateFormaDePagamentoDto): Promise<FormaDePagamentoEntity> {
    const formaDePagamento = await this.repository.save(createFormaDePagamentoDto);

    return this.findById(formaDePagamento.id);
  }

  async find(filter?: string): Promise<FormaDePagamentoEntity[]> {
    return this.repository.find({ where: { descricao: ILike(`%${filter ?? ''}%`) } });
  }

  async findById(id: number): Promise<FormaDePagamentoEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateFormaDePagamentoDto: UpdateFormaDePagamentoDto): Promise<FormaDePagamentoEntity> {
    await this.repository.update(id, updateFormaDePagamentoDto);

    return this.findById(id);
  }
}
