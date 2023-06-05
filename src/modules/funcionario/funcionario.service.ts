import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioEntity } from './entities/funcionario.entity';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(FuncionarioEntity)
    private repository: Repository<FuncionarioEntity>
  ) {}

  async create(createFuncionarioDto: CreateFuncionarioDto): Promise<FuncionarioEntity> {
    const funcionario = await this.repository.save(createFuncionarioDto);
    return this.findById(funcionario.id);
  }

  async find(empresaId?: number, nome?: string, inativo?: boolean): Promise<FuncionarioEntity[]> {
    return this.repository.find({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: inativo ? Not(IsNull()) : false } });
  }

  async findById(id: number): Promise<FuncionarioEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<FuncionarioEntity> {
    const funcionario = await this.findById(id);
    if (!funcionario) {
      throw new BadRequestException('Funcionario não encontrado');
    }
    await this.repository.update(id, updateFuncionarioDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const funcionario = await this.findById(id);
    if (!funcionario) {
      throw new BadRequestException('Funcionario não encontrado');
    }

    await this.repository.delete(id).catch(() => {
      throw new BadRequestException('Não foi possível excluir o funcionario');
    });
  }
}
