import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { EmailManagerService } from 'src/email-manager/email-manager.service';

import { CreateConfigSmtpDto } from './dto/create-config-smtp.dto';
import { UpdateConfigSmtpDto } from './dto/update-config-smtp.dto';
import { ConfigSmtpEntity } from './entities/config-smtp.entity';

@Injectable()
export class ConfigSmtpService {
  constructor(
    @InjectRepository(ConfigSmtpEntity)
    private readonly repository: Repository<ConfigSmtpEntity>,
    @Inject(forwardRef(() => EmailManagerService))
    private readonly emailManagerService: EmailManagerService,
  ) {}

  async create(dto: CreateConfigSmtpDto): Promise<ConfigSmtpEntity> {
    const config = await this.find();

    // Sempre garantir valores padrão para o template
    const assunto = '[APOLLO PDV] Código de Redefinição de Senha';
    const corpo = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{assunto}}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:40px 0;">

      <!-- Container -->
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background-color:#ffffff;">

        <!-- Header -->
        <tr>
          <td align="center" style="padding:40px 30px; background-color:#667eea;">
            <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">
              APOLLO PDV
            </h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:40px 30px; color:#333333;">
            <h2 style="margin:0 0 20px 0; font-size:24px;">
              Redefinição de Senha
            </h2>

            <p style="margin:0 0 20px 0; color:#666666; font-size:16px; line-height:1.5;">
              Você solicitou a redefinição de senha da sua conta. Use o código abaixo para criar uma nova senha:
            </p>

            <!-- Code box -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:30px 0; border-collapse:collapse;">
              <tr>
                <td align="center" style="padding:20px; background-color:#f8f9fa; border:2px dashed #667eea;">
                  <span style="font-size:32px; font-weight:bold; color:#667eea; letter-spacing:8px; font-family:'Courier New', Courier, monospace;">
                    {{codigo}}
                  </span>
                </td>
              </tr>
            </table>

            <p style="margin:20px 0; color:#666666; font-size:14px; line-height:1.5;">
              <strong>Este código é válido por 15 minutos.</strong>
            </p>

            <p style="margin:20px 0; color:#666666; font-size:14px; line-height:1.5;">
              Se você não solicitou esta redefinição, ignore este e-mail. Sua senha permanecerá inalterada.
            </p>
          </td>
        </tr>

        <!-- Security -->
        <tr>
          <td style="padding:30px; background-color:#fff3cd; border-top:3px solid #ffc107;">
            <p style="margin:0; color:#856404; font-size:14px; line-height:1.5;">
              <strong>Dica de Segurança:</strong><br>
              Nunca compartilhe este código com ninguém. Nossa equipe nunca solicitará este código por telefone, e-mail ou mensagem.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:30px; background-color:#f8f9fa; border-top:1px solid #e9ecef;">
            <p style="margin:0 0 10px 0; color:#999999; font-size:12px;">
              © {{ano}} APOLLO PDV. Todos os direitos reservados.
            </p>
            <p style="margin:0; color:#999999; font-size:12px;">
              Este é um e-mail automático, por favor não responda.
            </p>
          </td>
        </tr>

      </table>
      <!-- /Container -->

    </td>
  </tr>
</table>
</body>
</html>`;

    const entity = this.repository.create({
      ...config,
      ...dto,
      redefinirSenhaTemplate: {
        assunto: config?.redefinirSenhaTemplate?.assunto || dto.redefinirSenhaTemplate?.assunto || assunto,
        corpo: config?.redefinirSenhaTemplate?.corpo || dto.redefinirSenhaTemplate?.corpo || corpo,
      },
    });

    entity.redefinirSenhaTemplate = {
      assunto,
      corpo,
    };

    return this.repository.save(entity);
  }

  async find(): Promise<ConfigSmtpEntity> {
    return this.repository.findOne({ where: { id: Not(IsNull()) } });
  }

  async put(dto: UpdateConfigSmtpDto): Promise<ConfigSmtpEntity> {
    const config = await this.find();

    Object.assign(config, {
      ...dto,
      redefinirSenhaTemplate: {
        ...config.redefinirSenhaTemplate,
        ...dto.redefinirSenhaTemplate,
      },
    });

    return this.create(config);
  }

  async validateConnection(): Promise<boolean> {
    return this.emailManagerService.verifyConnection();
  }
}
