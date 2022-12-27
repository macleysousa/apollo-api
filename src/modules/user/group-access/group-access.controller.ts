import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupAccessService } from './group-access.service';
import { CreateGroupAccessDto } from './dto/create-group-access.dto';
import { UpdateGroupAccessDto } from './dto/update-group-access.dto';

@Controller('group-access')
export class GroupAccessController {
  constructor(private readonly groupAccessService: GroupAccessService) {}

  @Post()
  create(@Body() createGroupAccessDto: CreateGroupAccessDto) {
    return this.groupAccessService.create(createGroupAccessDto);
  }

  @Get()
  findAll() {
    return this.groupAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupAccessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupAccessDto: UpdateGroupAccessDto) {
    return this.groupAccessService.update(+id, updateGroupAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupAccessService.remove(+id);
  }
}
