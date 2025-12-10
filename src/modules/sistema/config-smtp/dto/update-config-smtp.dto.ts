import { PartialType } from '@nestjs/swagger';

import { CreateConfigSmtpDto } from './create-config-smtp.dto';

export class UpdateConfigSmtpDto extends PartialType(CreateConfigSmtpDto) {}
