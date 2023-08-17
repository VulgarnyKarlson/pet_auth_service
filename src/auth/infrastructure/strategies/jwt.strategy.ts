import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtAuthPayload } from 'auth/domain/security/jwt-payload.interfaces';
import { AppConfig } from 'config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AppConfig.JWT.authSecret,
        });
    }

    validate(payload: JwtAuthPayload): JwtAuthPayload {
        return payload
    }
}
