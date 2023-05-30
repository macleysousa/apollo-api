import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalEntity } from './entities/terminal.entity';

@Injectable()
export class UsuarioTerminalService {
  constructor(
    @InjectRepository(UsuarioTerminalEntity)
    private repository: Repository<UsuarioTerminalEntity>
  ) {}

  async add(usuarioId: number, addUsuarioTerminalDto: AddUsuarioTerminalDto): Promise<TerminalEntity> {
    await this.repository.upsert({ ...addUsuarioTerminalDto, usuarioId }, { conflictPaths: ['usuarioId', 'empresaId', 'terminalId'] });

    const { terminal } = await this.findByTerminalId(usuarioId, addUsuarioTerminalDto.terminalId);
    return terminal;
  }

  async find(usuarioId: number): Promise<TerminalEntity[]> {
    const terminais = await this.repository.find({ where: { usuarioId } });
    return terminais.map(({ terminal }) => terminal);
  }

  async findByEmpresaId(usuarioId: number, empresaId: number): Promise<TerminalEntity[]> {
    const terminais = await this.repository.find({ where: { usuarioId, empresaId } });
    return terminais.map(({ terminal }) => terminal);
  }

  async findByTerminalId(usuarioId: number, terminalId: number): Promise<UsuarioTerminalEntity> {
    return this.repository.findOne({ where: { usuarioId, terminalId } });
  }

  async delete(usuarioId: number, terminalId: number): Promise<void> {
    await this.repository.delete({ usuarioId, terminalId }).catch(() => {
      throw new BadRequestException('Não foi possível remover o terminal');
    });
  }
}
