import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';

import { ApiComponent } from '../component/component.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAccessEntity } from './entities/user-access.entity';
import { UserEntity } from './entities/user.entity';
import { Role } from './enum/user-role.enum';
import { Roles } from './roles.decorator';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiComponent('ADMFM001', 'Manutenção de usuário')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({ type: UserEntity, status: 201 })
    @Roles(Role.ADMIN, Role.SYSADMIN)
    async create(@CurrentUser() user: UserEntity, @Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        if (user.role != Role.SYSADMIN && createUserDto.role == Role.SYSADMIN) {
            throw new UnauthorizedException('To create sysadmin user you must have sysadmin access');
        }
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiResponse({ type: [UserEntity], status: 200 })
    @Roles(Role.ADMIN, Role.SYSADMIN)
    @ApiQuery({ name: 'name', type: 'string', required: false })
    async find(@Query('name') name: string): Promise<UserEntity[]> {
        return this.userService.find(name);
    }

    @Get(':id')
    @ApiResponse({ type: UserEntity, status: 200 })
    async findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @Get(':id/accesses')
    @ApiResponse({ type: UserAccessEntity, isArray: true, status: 200 })
    @ApiQuery({ name: 'branchId', required: false })
    @ApiQuery({ name: 'componentId', required: false })
    async findAccesses(
        @Param('id', ParseIntPipe) id: number,
        @Query('branchId') branchId?: string,
        @Query('componentId') componentId?: string
    ): Promise<UserAccessEntity[]> {
        return this.userService.findAccesses(id, { branchId: +branchId ? +branchId : null, componentId });
    }

    @Put(':id')
    @ApiResponse({ type: UserEntity, status: 200 })
    @Roles(Role.ADMIN, Role.SYSADMIN)
    async update(
        @CurrentUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserEntity> {
        if (user.role != Role.SYSADMIN && updateUserDto.role == Role.SYSADMIN) {
            throw new UnauthorizedException('To update user to sysadmin you must have sysadmin access');
        }
        return this.userService.update(id, updateUserDto);
    }
}
