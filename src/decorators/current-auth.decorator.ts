import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface AuthRequest extends Request {
    user: UserEntity;
    branch?: BranchEntity;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
});

export const CurrentBranch = createParamDecorator((data: unknown, context: ExecutionContext): BranchEntity => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.branch;
});
