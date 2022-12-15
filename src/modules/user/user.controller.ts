import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Put } from '@nestjs/common/decorators';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiQuery({ name: 'name', type: 'string', required: false })
    async find(@Query('name') name: string): Promise<UserEntity[]> {
        return this.userService.find(name);
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
        return this.userService.update(id, updateUserDto);
    }
}
