import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalEntity } from './entities/terminal.entity';
import { UsuarioTerminalView } from './views/terminal.view';

@Injectable()
export class UsuarioTerminalService {
  constructor(
    @InjectRepository(UsuarioTerminalEntity)
    private repository: Repository<UsuarioTerminalEntity>,
    @InjectRepository(UsuarioTerminalView)
    private viewRepository: Repository<UsuarioTerminalView>,
  ) {}

  async add(usuarioId: number, addUsuarioTerminalDto: AddUsuarioTerminalDto): Promise<UsuarioTerminalView> {
    await this.repository.upsert(
      { ...addUsuarioTerminalDto, usuarioId },
      { conflictPaths: ['usuarioId', 'empresaId', 'terminalId'] },
    );

    return this.findByTerminalId(usuarioId, addUsuarioTerminalDto.terminalId);
  }

  async find(usuarioId: number): Promise<UsuarioTerminalView[]> {
    return this.viewRepository.find({ where: { usuarioId } });
  }

  async findByEmpresaId(usuarioId: number, empresaId: number): Promise<UsuarioTerminalView[]> {
    return this.viewRepository.find({ where: { usuarioId, empresaId } });
  }

  async findByTerminalId(usuarioId: number, terminalId: number): Promise<UsuarioTerminalView> {
    return this.viewRepository.findOne({ where: { usuarioId, id: terminalId } });
  }

  async delete(usuarioId: number, terminalId: number): Promise<void> {
    await this.repository.delete({ usuarioId, terminalId }).catch(() => {
      throw new BadRequestException('Não foi possível remover o terminal');
    });
  }
}
