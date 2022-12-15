import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface AuthRequest extends Request {
    user: UserEntity;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
});
