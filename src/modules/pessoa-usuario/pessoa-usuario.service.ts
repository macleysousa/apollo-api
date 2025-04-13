import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { LoginResponse } from './responses/login.response';

@Injectable()
export class PessoaUsuarioService {
  constructor(
    @InjectRepository(PessoaUsuario)
    private readonly repository: Repository<PessoaUsuario>,
    private readonly keycloakService: KeycloakService,
    private readonly pessoaService: PessoaService,
  ) {}

  async register(dto: CreatePessoaUsuarioDto): Promise<string> {
    const [emailExists, documentoExists] = await Promise.all([
      this.repository.existsBy({ email: dto.email }),
      this.repository.existsBy({ documento: dto.documento }),
    ]);

    if (emailExists) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    if (documentoExists) {
      throw new BadRequestException('Documento já cadastrado');
    }

    const usuarioId = await this.keycloakService.register({
      email: dto.email,
      password: dto.senha,
      firstName: dto.nome,
      lastName: dto.sobrenome,
    });

    const pessoa = await this.pessoaService.findByDocumento(dto.documento);

    await this.repository.insert({ id: usuarioId, pessoaId: pessoa?.id, ...dto });

    return 'Usuário cadastrado com sucesso';
  }

  async login(dto: LoginPessoaUsuarioDto): Promise<LoginResponse> {
    // const usuario = await this.repository.existsBy({ email: dto.email });
    // if (!usuario) {
    //   throw new BadRequestException('Usuário não encontrado');
    // }

    const access = await this.keycloakService.login(dto.email, dto.senha);
    if (!access) {
      throw new BadRequestException('Falha ao gerar token');
    }

    return {
      tokenDeAcesso: access.access_token,
      tokenDeAtualizacao: access.refresh_token,
      tipoDeToken: access.token_type,
      expiracao: new Date(Date.now() + access.expires_in * 1000),
    };
  }

  async find(): Promise<PessoaUsuario[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<PessoaUsuario> {
    return this.repository.findOne({ where: { id } });
  }
}
