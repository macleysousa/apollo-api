import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { TerminalEntity } from './entities/terminal.entity';

@Injectable()
export class TerminalService {
  constructor(
    @InjectRepository(TerminalEntity)
    private repository: Repository<TerminalEntity>
  ) {}

  async create(empresaId: number, createTerminalDto: CreateTerminalDto): Promise<TerminalEntity> {
    const terminal = await this.repository.save({ ...createTerminalDto, empresaId });

    return this.findById(empresaId, terminal.id);
  }

  async find(empresaId: number): Promise<TerminalEntity[]> {
    return this.repository.find({ where: { empresaId } });
  }

  async findById(empresaId: number, id: number): Promise<TerminalEntity> {
    return this.repository.findOne({ where: { id, empresaId } });
  }

  async update(empresaId: number, id: number, updateTerminalDto: UpdateTerminalDto): Promise<TerminalEntity> {
    await this.repository.update({ empresaId, id }, updateTerminalDto);

    return this.findById(empresaId, id);
  }

  async delete(empresaId: number, id: number): Promise<void> {
    await this.repository.delete({ empresaId, id }).catch(() => {
      throw new Error('Não foi possível excluir o terminal');
    });
  }
}
