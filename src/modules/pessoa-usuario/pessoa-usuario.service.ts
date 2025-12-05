import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import { Repository } from 'typeorm';

import { isCNPJ, isValidDocument } from 'src/commons/validations/is-document.validation';
import { ContextService } from 'src/context/context.service';
import { KeycloakService } from 'src/keycloak/keycloak.service';

import { ContatoTipo } from '../pessoa/enum/contato-tipo.enum';
import { PessoaTipo } from '../pessoa/enum/pessoa-tipo.enum';
import { PessoaService } from '../pessoa/pessoa.service';

import { ChangePasswordDto } from './dto/change-password.dto';
import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { RequestResetCodeDto } from './dto/request-reset-code.dto';
import { ResetPasswordWithCodeDto } from './dto/reset-password-with-code.dto';
import { UpdatePessoaUsuarioDto } from './dto/update-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { LoginResponse } from './responses/login.response';
import { PasswordResetResponse } from './responses/password-reset.response';
import { ResetCodeResponse } from './responses/reset-code.response';
import { VerifyResponse } from './responses/verify.response';

@Injectable()
export class PessoaUsuarioService {
  constructor(
    @InjectRepository(PessoaUsuario)
    private readonly repository: Repository<PessoaUsuario>,
    private readonly keycloakService: KeycloakService,
    private readonly pessoaService: PessoaService,
    private readonly context: ContextService,
  ) {}

  async register({ empresaId, ...dto }: CreatePessoaUsuarioDto): Promise<string> {
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

    let pessoa = await this.pessoaService.findByDocumento(dto.documento);

    if (!pessoa) {
      pessoa = await this.pessoaService.create(empresaId, {
        nome: `${dto.nome} ${dto.sobrenome}`,
        documento: dto.documento,
        email: dto.email,
        tipo: isCNPJ(dto.documento) ? PessoaTipo.Jurídica : PessoaTipo.Física,
        tipoContato: ContatoTipo.WhatsApp,
        contato: dto.telefone,
        nascimento: dto.dataNascimento,
        cliente: true,
      });
    }

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

  async findPerfil(): Promise<PessoaUsuario> {
    const pessoaId = this.context.pessoaId();
    return this.repository.findOne({ where: { id: pessoaId } });
  }

  async updatePerfil(dto: UpdatePessoaUsuarioDto): Promise<PessoaUsuario> {
    const pessoaId = this.context.pessoaId();
    await this.repository.update({ id: pessoaId }, dto);

    return this.repository.findOne({ where: { id: pessoaId } });
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<PasswordResetResponse> {
    const usuario = await this.repository.existsBy({ email: dto.email });
    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'E-mail não encontrado',
      };
    }

    try {
      await this.keycloakService.sendResetPasswordEmail(dto.email);
      return {
        sucesso: true,
        mensagem: 'E-mail de redefinição de senha enviado com sucesso',
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: 'Erro ao enviar e-mail de redefinição de senha',
      };
    }
  }

  async requestResetCode(dto: RequestResetCodeDto): Promise<ResetCodeResponse> {
    const usuario = await this.repository.existsBy({ email: dto.email });
    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'E-mail não encontrado',
      };
    }

    try {
      const codigo = await this.keycloakService.generateResetPasswordToken(dto.email);

      // Em produção, o código seria enviado por e-mail/SMS
      // Por enquanto, retornamos o código para facilitar testes
      const isProduction = process.env.NODE_ENV === 'production';

      return {
        sucesso: true,
        mensagem: isProduction ? 'Código de redefinição enviado para seu e-mail' : 'Código de redefinição gerado com sucesso',
        codigo: isProduction ? undefined : codigo,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: 'Erro ao gerar código de redefinição',
      };
    }
  }

  async resetPasswordWithCode(dto: ResetPasswordWithCodeDto): Promise<PasswordResetResponse> {
    try {
      await this.keycloakService.resetPasswordWithToken(dto.codigo, dto.novaSenha);
      return {
        sucesso: true,
        mensagem: 'Senha redefinida com sucesso',
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: 'Código inválido ou expirado',
      };
    }
  }

  async changePassword(dto: ChangePasswordDto): Promise<PasswordResetResponse> {
    const pessoaUsuario = await this.findPerfil();
    if (!pessoaUsuario) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      };
    }

    try {
      // Primeiro valida a senha atual fazendo login
      const loginResult = await this.keycloakService.login(pessoaUsuario.email, dto.senhaAtual);
      if (!loginResult) {
        return {
          sucesso: false,
          mensagem: 'Senha atual incorreta',
        };
      }
    } catch (error) {
      return {
        sucesso: false,
        mensagem: 'Senha atual incorreta',
      };
    }

    try {
      // Se a senha atual está correta, redefine para a nova senha
      await this.keycloakService.resetPassword(pessoaUsuario.email, dto.novaSenha);
      return {
        sucesso: true,
        mensagem: 'Senha alterada com sucesso',
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: 'Erro ao alterar senha',
      };
    }
  }
}
