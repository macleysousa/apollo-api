import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';
import { UsuarioEntity } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private userRepository: Repository<UsuarioEntity>,
    @InjectRepository(UsuarioAcessoEntity)
    private userAccessView: Repository<UsuarioAcessoEntity>
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

  async findById(id: number): Promise<UsuarioEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUserName(username: string): Promise<UsuarioEntity> {
    return this.userRepository.findOne({ where: { usuario: username } });
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
