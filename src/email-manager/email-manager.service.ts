import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import { ConfigSmtpService } from 'src/modules/sistema/config-smtp/config-smtp.service';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

@Injectable()
export class EmailManagerService {
  private readonly logger = new Logger(EmailManagerService.name);

  constructor(private readonly configSmtpService: ConfigSmtpService) {}

  async transporter(): Promise<Transporter> {
    const config = await this.configSmtpService.find();
    if (!config) {
      throw new BadRequestException('Configuração SMTP não encontrada', {
        description: 'Por favor, entre em contato com o administrador do sistema para configurar o SMTP.',
      });
    }

    return nodemailer.createTransport({
      host: config.servidor,
      port: config.porta,
      secure: config.porta === 465,
      auth: {
        user: config.usuario,
        pass: config.senha,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const transporter = await this.transporter();
      const from = (transporter.options as any).auth?.user;

      const mailOptions = {
        from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
        attachments: options.attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado com sucesso: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = await this.transporter();

      await transporter.verify();
      this.logger.log('Conexão SMTP verificada com sucesso');
      return true;
    } catch (error) {
      this.logger.error(`Erro ao verificar conexão SMTP: ${error.message}`, error.stack);
      return false;
    }
  }
}
