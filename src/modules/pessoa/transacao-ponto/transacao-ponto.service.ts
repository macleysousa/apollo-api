import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CancelTransacaoPontoDto } from './dto/cancel-transacao-ponto.dto';
import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';

@Injectable()
export class TransacaoPontoService {
  constructor(
    @InjectRepository(TransacaoPontoEntity)
    private readonly repository: Repository<TransacaoPontoEntity>,
  ) {}

  async create(pessoaId: number, dto: CreateTransacaoPontoDto): Promise<TransacaoPontoEntity> {
    return;
  }

  async find(pessoaId: number): Promise<TransacaoPontoEntity[]> {
    return;
  }

  async findById(pessoaId: number, id: number): Promise<TransacaoPontoEntity> {
    return;
  }

  async cancel(pessoaId: number, id: number, dto: CancelTransacaoPontoDto): Promise<void> {
    return;
  }
}
