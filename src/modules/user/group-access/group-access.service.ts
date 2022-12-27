import { Injectable } from '@nestjs/common';
import { CreateGroupAccessDto } from './dto/create-group-access.dto';
import { UpdateGroupAccessDto } from './dto/update-group-access.dto';

@Injectable()
export class GroupAccessService {
  create(createGroupAccessDto: CreateGroupAccessDto) {
    return 'This action adds a new groupAccess';
  }

  findAll() {
    return `This action returns all groupAccess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupAccess`;
  }

  update(id: number, updateGroupAccessDto: UpdateGroupAccessDto) {
    return `This action updates a #${id} groupAccess`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupAccess`;
  }
}
