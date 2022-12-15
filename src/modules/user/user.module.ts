import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { IsUserNameUniqueConstraint } from './validations/is-username-unique.validation';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, IsUserNameUniqueConstraint],
    exports: [UserService],
})
export class UserModule {}
