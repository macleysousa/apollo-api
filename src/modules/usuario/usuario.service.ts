import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';
import { UsuarioRelation } from './relations/usuario.relation';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private userRepository: Repository<UsuarioEntity>,
    @InjectRepository(UsuarioAcessoEntity)
    private userAccessView: Repository<UsuarioAcessoEntity>,
  ) {}

  async create(createUserDto: CriarUsuarioDto): Promise<UsuarioEntity> {
    const user = await this.userRepository.save({ ...createUserDto });
    return this.findById(user.id);
  }

  async find(nome?: string): Promise<UsuarioEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('c');
    queryBuilder.where({ id: Not(IsNull()) });
    if (nome) {
      queryBuilder.andWhere({ nome: ILike(`%${nome}%`) });
    }
    return queryBuilder.getMany();
  }

  async findById(id: number, relations?: UsuarioRelation[]): Promise<UsuarioEntity> {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  async findByUserName(username: string, relations?: UsuarioRelation[]): Promise<UsuarioEntity> {
    return this.userRepository.findOne({ where: { usuario: username }, relations });
  }

  async findAccesses(id: number, filter?: { empresaId?: number; componenteId?: string }): Promise<UsuarioAcessoEntity[]> {
    return this.userAccessView.find({ where: { id, ...filter } });
  }

  async update(id: number, dto: AtualizarUsuarioDto): Promise<UsuarioEntity> {
    await this.userRepository.update(id, { ...dto });

    return this.findById(id);
  }

  async validateUser(usuario: string, senha: string): Promise<UsuarioEntity> {
    const user = await this.findByUserName(usuario);

    if (!user || user.senha != senha) {
      throw new UnauthorizedException('usuario ou senha inválida');
    }
    return user;
  }
}
