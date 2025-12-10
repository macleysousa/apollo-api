import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

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
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const from = options.from || process.env.SMTP_USER;

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

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado com sucesso: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexão SMTP verificada com sucesso');
      return true;
    } catch (error) {
      this.logger.error(`Erro ao verificar conexão SMTP: ${error.message}`, error.stack);
      return false;
    }
  }
}
