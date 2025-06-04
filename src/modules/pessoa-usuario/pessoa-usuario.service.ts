import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import { Repository } from 'typeorm';

import { isValidDocument } from 'src/commons/validations/is-document.validation';
import { KeycloakService } from 'src/keycloak/keycloak.service';

import { PessoaService } from '../pessoa/pessoa.service';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { LoginResponse } from './responses/login.response';
import { VerifyResponse } from './responses/verify.response';

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
    const usuario = await this.repository.existsBy({ email: dto.email });
    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

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

  async validateToken(token: string): Promise<PessoaUsuario> {
    const usuarioId = await this.keycloakService.validateToken(token);

    return this.repository.findOne({ where: { id: usuarioId }, cache: true });
  }

  async findPerfil(token: string): Promise<PessoaUsuario> {
    const usuarioId = await this.keycloakService.validateToken(token);
    return this.repository.findOne({ where: { id: usuarioId } });
  }

  async verifyDocument(documento: string): Promise<VerifyResponse> {
    if (!isValidDocument(documento)) {
      return {
        valido: false,
        mensagem: 'Documento deve ser um CPF ou CNPJ válido.',
      };
    }

    const exists = await this.repository.existsBy({ documento });
    if (exists) {
      return {
        valido: false,
        mensagem: 'Documento já cadastrado',
      };
    }

    return {
      valido: true,
      mensagem: 'Documento válido e não cadastrado',
    };
  }

  async verifyEmail(email: string): Promise<VerifyResponse> {
    if (!isEmail(email)) {
      return {
        valido: false,
        mensagem: 'E-mail inválido',
      };
    }
    const exists = await this.repository.existsBy({ email });
    if (exists) {
      return {
        valido: false,
        mensagem: 'E-mail já cadastrado',
      };
    }

    return {
      valido: true,
      mensagem: 'E-mail válido e não cadastrado',
    };
  }
}
