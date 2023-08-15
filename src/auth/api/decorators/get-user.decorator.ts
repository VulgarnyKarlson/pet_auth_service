import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtRefreshPayload } from 'auth/domain/security/jwt-payload.interfaces';

export const getUserDecorator = createParamDecorator(
    (data: keyof JwtRefreshPayload | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>()
        if (!data) {
            return request.user;
        }
        return request.user;
    },
);
