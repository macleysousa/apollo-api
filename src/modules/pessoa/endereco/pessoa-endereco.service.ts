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
    private repository: Repository<PessoaEnderecoEntity>,
  ) {}

  async create(pessoaId: number, dto: CreatePessoaEnderecoDto): Promise<PessoaEnderecoEntity> {
    // Se o endereço sendo criado é principal, desmarcar todos os outros
    if (dto.principal) {
      await this.desmarcarEnderecoPrincipal(pessoaId);
    }

    const pessoaEndereco = await this.repository.save({ ...dto, pessoaId });
    return this.findById(pessoaId, pessoaEndereco.id);
  }

  async findAll(pessoaId: number): Promise<PessoaEnderecoEntity[]> {
    return this.repository.find({ where: { pessoaId } });
  }

  async findById(pessoaId: number, id: number): Promise<PessoaEnderecoEntity> {
    const pessoaEndereco = await this.repository.findOne({ where: { id, pessoaId } });

    if (!pessoaEndereco) {
      throw new BadRequestException(`Endereço com id ${id} não encontrado`);
    }

    return pessoaEndereco;
  }

  async update(pessoaId: number, id: number, dto: UpdatePessoaEnderecoDto): Promise<PessoaEnderecoEntity> {
    const pessoaEndereco = await this.repository.findOne({ where: { id, pessoaId } });

    if (!pessoaEndereco) {
      throw new BadRequestException(`Endereço com id ${id} não encontrado`);
    }

    // Se o endereço está sendo marcado como principal, desmarcar todos os outros
    if (dto.principal != undefined && dto.principal) {
      await this.desmarcarEnderecoPrincipal(pessoaEndereco.pessoaId);
    }

    await this.repository.update({ id }, dto);

    return this.findById(pessoaId, id);
  }

  async delete(pessoaId: number, id: number): Promise<void> {
    await this.repository.delete({ id, pessoaId });
  }

  /**
   * Desmarca todos os endereços principais de uma pessoa
   * @param pessoaId ID da pessoa
   */
  private async desmarcarEnderecoPrincipal(pessoaId: number): Promise<void> {
    await this.repository.update({ pessoaId }, { principal: false });
  }
}
