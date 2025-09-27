import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthRequest } from 'src/decorators/current-auth.decorator';

import { AdicionarUsuarioGrupoDto } from './dto/adicionar-usuario-grupo.dto';
import { UsuarioGrupoEntity } from './entities/grupo-acesso.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsuarioGrupoService {
  constructor(
    @Inject(REQUEST) private request: AuthRequest,
    @InjectRepository(UsuarioGrupoEntity)
    private repository: Repository<UsuarioGrupoEntity>,
  ) {}

  async add(usuarioId: number, createGroupAccessDto: AdicionarUsuarioGrupoDto): Promise<UsuarioGrupoEntity> {
    const access = await this.repository
      .save({ ...createGroupAccessDto, usuarioId, operadorId: this.request.usuario.id })
      .catch(() => {
        throw new BadRequestException(`usuário, empresa ou grupo inválido`);
      });
    return this.findByBranchIdAndGroupId(access.usuarioId, access.empresaId, access.grupoId);
  }

  async find(usuarioId: number, relations = ['grupo', 'grupo.itens.componente']): Promise<UsuarioGrupoEntity[]> {
    return this.repository.find({ where: { usuarioId }, relations });
  }

  async findByBranchId(
    usuarioId: number,
    empresaId: number,
    relations = ['grupo', 'grupo.itens.componente'],
  ): Promise<UsuarioGrupoEntity[]> {
    return this.repository.find({ where: { usuarioId, empresaId }, relations });
  }

  async findByBranchIdAndGroupId(
    usuarioId: number,
    empresaId: number,
    grupoId: number,
    relations = ['grupo', 'grupo.itens.componente'],
  ): Promise<UsuarioGrupoEntity> {
    return this.repository.findOne({ where: { usuarioId, empresaId, grupoId }, relations });
  }

  async remove(usuarioId: number, empresaId: number, grupoId: number): Promise<void> {
    await this.repository.delete({ usuarioId, empresaId, grupoId });
  }
}
