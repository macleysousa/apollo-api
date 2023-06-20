import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePessoaEnderecoDto } from './dto/create-pessoa-endereco.dto';
import { UpdatePessoaEnderecoDto } from './dto/update-pessoa-endereco.dto';
import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';

@Injectable()
export class PessoaEnderecoService {
  constructor(
    @InjectRepository(PessoaEnderecoEntity)
    private repository: Repository<PessoaEnderecoEntity>
  ) {}

  async create(pessoaId: number, createPessoaEnderecoDto: CreatePessoaEnderecoDto): Promise<PessoaEnderecoEntity> {
    const pessoaEndereco = await this.repository.save({ ...createPessoaEnderecoDto, pessoaId });
    return this.findById(pessoaEndereco.pessoaId);
  }

  async findById(pessoaId: number): Promise<PessoaEnderecoEntity> {
    const pessoaEndereco = await this.repository.findOne({ where: { pessoaId } });

    if (!pessoaEndereco) {
      throw new BadRequestException(`PessoaEndereco com id ${pessoaId} não encontrado`);
    }

    return pessoaEndereco;
  }

  async update(pessoaId: number, updatePessoaEnderecoDto: UpdatePessoaEnderecoDto): Promise<PessoaEnderecoEntity> {
    const pessoaEndereco = await this.repository.findOne({ where: { pessoaId } });

    if (!pessoaEndereco) {
      throw new BadRequestException(`PessoaEndereco com id ${pessoaId} não encontrado`);
    }

    await this.repository.update({ pessoaId }, updatePessoaEnderecoDto);

    return this.findById(pessoaId);
  }

  async delete(pessoaId: number): Promise<void> {
    await this.repository.delete({ pessoaId });
  }
}
