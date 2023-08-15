import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtAuthPayload, JwtRefreshPayload } from 'auth/domain/security/jwt-payload.interfaces';
import { AppConfig } from 'config/app.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AppConfig.JWT.refreshSecret,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtAuthPayload): JwtRefreshPayload {
        const refreshToken = req
            ?.get('authorization')
            ?.replace('Bearer', '')
            .trim();
        if (!refreshToken) {throw new ForbiddenException('Refresh token malformed');}

        return {
            ...payload,
            refreshToken,
        };
    }
}
