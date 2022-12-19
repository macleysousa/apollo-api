import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Put } from '@nestjs/common/decorators';
import { UserEntity } from './entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from './enum/user-role.enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Roles(Role.ADMIN, Role.SYSADMIN)
    async create(@CurrentUser() user: UserEntity, @Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        if (user.role != Role.SYSADMIN && createUserDto.role == Role.SYSADMIN) {
            throw new UnauthorizedException('To create sysadmin user you must have sysadmin access');
        }
        return this.userService.create(createUserDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SYSADMIN)
    @ApiQuery({ name: 'name', type: 'string', required: false })
    async find(@Query('name') name: string): Promise<UserEntity[]> {
        return this.userService.find(name);
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SYSADMIN)
    async update(@CurrentUser() user: UserEntity, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
        if (user.role != Role.SYSADMIN && updateUserDto.role == Role.SYSADMIN) {
            throw new UnauthorizedException('To update user to sysadmin you must have sysadmin access');
        }
        return this.userService.update(id, updateUserDto);
    }
}
