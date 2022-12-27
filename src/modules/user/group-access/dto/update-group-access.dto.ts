import { PartialType } from '@nestjs/swagger';
import { CreateGroupAccessDto } from './create-group-access.dto';

export class UpdateGroupAccessDto extends PartialType(CreateGroupAccessDto) {}
