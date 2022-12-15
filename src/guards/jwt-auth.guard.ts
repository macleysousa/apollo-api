import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { TenantRequest } from 'src';
import { AuthService } from '../modules/auth/auth.service';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private AuthService: AuthService) {
        super();
    }

    private getTokenFromRequest(request: TenantRequest): string {
        const authHeader = Object.keys(request.headers).find(h => h.toLowerCase() === 'authorization');

        if (!authHeader) {
            throw new UnauthorizedException('Token is not present');
        }

        const authorization = request.headers[authHeader] as string;

        const authParts = authorization.split(' ');
        if (authParts[0].toLowerCase() !== 'bearer') {
            throw new UnauthorizedException('Invalid token');
        }

        return authParts[1] as string;
    }

    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (isPublic) {
            return true;
        }

        const token = this.getTokenFromRequest(request);
        if (!token) {
            throw new UnauthorizedException('Invalid or not provided auth token');
        }
        return this.AuthService.validateToken(token).then(async user => {
            if (!user) throw new UnauthorizedException('Invalid token');
            request.user = user;
            return true;
        });
    }
}
