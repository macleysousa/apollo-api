import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import { Repository } from 'typeorm';

import { isCNPJ, isValidDocument } from 'src/commons/validations/is-document.validation';
import { ContextService } from 'src/context/context.service';
import { EmailManagerService, SendEmailOptions } from 'src/email-manager/email-manager.service';
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
    private readonly emailManagerService: EmailManagerService,
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

      const payload: SendEmailOptions = {
        to: dto.email,
        subject: '[APOLLO PDV] Código de Redefinição de Senha',
        text: `Você solicitou a redefinição de senha da sua conta. Use o código abaixo para criar uma nova senha:\n\n${codigo}\n\nEste código é válido por 10 minutos.\n\nSe você não solicitou esta redefinição, ignore este e-mail. Sua senha permanecerá inalterada.\n\nDica de Segurança: Nunca compartilhe este código com ninguém. Nossa equipe nunca solicitará este código por telefone, e-mail ou mensagem.\n\n© ${new Date().getFullYear()} APOLLO PDV. Todos os direitos reservados.\nEste é um e-mail automático, por favor não responda.`,
        //     html: `
        //   <!DOCTYPE html>
        //   <html lang="pt-BR">
        //   <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>Redefinição de Senha</title>
        //   </head>
        //   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        //     <table role="presentation" style="width: 100%; border-collapse: collapse;">
        //       <tr>
        //         <td align="center" style="padding: 40px 0;">
        //           <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        //             <!-- Header -->
        //             <tr>
        //               <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
        //                 <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">APOLLO PDV</h1>
        //               </td>
        //             </tr>

        //             <!-- Content -->
        //             <tr>
        //               <td style="padding: 40px 30px;">
        //                 <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Redefinição de Senha</h2>
        //                 <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
        //                   Você solicitou a redefinição de senha da sua conta. Use o código abaixo para criar uma nova senha:
        //                 </p>

        //                 <!-- Code Box -->
        //                 <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
        //                   <tr>
        //                     <td align="center" style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #667eea;">
        //                       <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
        //                         ${codigo}
        //                       </span>
        //                     </td>
        //                   </tr>
        //                 </table>

        //                 <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">
        //                   <strong>⏱️ Este código é válido por 10 minutos.</strong>
        //                 </p>

        //                 <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">
        //                   Se você não solicitou esta redefinição, ignore este e-mail. Sua senha permanecerá inalterada.
        //                 </p>
        //               </td>
        //             </tr>

        //             <!-- Security Notice -->
        //             <tr>
        //               <td style="padding: 30px; background-color: #fff3cd; border-top: 3px solid #ffc107;">
        //                 <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
        //                   <strong>🔒 Dica de Segurança:</strong><br>
        //                   Nunca compartilhe este código com ninguém. Nossa equipe nunca solicitará este código por telefone, e-mail ou mensagem.
        //                 </p>
        //               </td>
        //             </tr>

        //             <!-- Footer -->
        //             <tr>
        //               <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
        //                 <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
        //                   © ${new Date().getFullYear()} APOLLO PDV. Todos os direitos reservados.
        //                 </p>
        //                 <p style="margin: 0; color: #999999; font-size: 12px;">
        //                   Este é um e-mail automático, por favor não responda.
        //                 </p>
        //               </td>
        //             </tr>
        //           </table>
        //         </td>
        //       </tr>
        //     </table>
        //   </body>
        //   </html>
        // `,
      };

      await this.emailManagerService.sendEmail(payload);

      return {
        sucesso: true,
        mensagem: 'Código de redefinição de senha enviado com sucesso',
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
