import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { LoginDto } from 'auth/application/dtos/login.dto';
import { UserService } from 'auth/application/services/user.service';
import { JwtAuthPayload } from 'auth/domain/security/jwt-payload.interfaces';
import { AppConfig } from 'config/app.config';
import { RegisterDto } from 'auth/application/dtos/register.dto';
import { Tokens } from 'auth/application/interfaces/tokens.interfaces';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signup(dto: RegisterDto): Promise<Tokens> {
        const user = await this.userService.create(dto.email, dto.username, dto.password);
        const tokens = await this.getTokens(user.id, user.username);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async signin(dto: LoginDto): Promise<Tokens> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

        const passwordMatches = await argon.verify(user.hashAuth, dto.password);
        if (!passwordMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string): Promise<boolean> {
        await this.userService.clearRefreshToken(userId);
        return true;
    }

    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashRefresh) {
            throw new ForbiddenException('Access Denied');
        }

        const rtMatches = await argon.verify(user.hashRefresh, rt);
        if (!rtMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async getTokens(userId: string, username: string): Promise<Tokens> {
        const jwtPayload: JwtAuthPayload = {
            sub: userId,
            username: username,
        };


        const accessToken = await this.jwtService.signAsync(jwtPayload, {
            secret: AppConfig.JWT.authSecret,
            expiresIn: AppConfig.JWT.accessExpiresIn,
        });
        const refreshToken = await this.jwtService.signAsync(jwtPayload, {
            secret: AppConfig.JWT.refreshSecret,
            expiresIn: AppConfig.JWT.refreshExpiresIn,
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    async validateAuthToken(token: string): Promise<JwtAuthPayload|null> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: AppConfig.JWT.authSecret,
            });
        } catch (e) {
            return null;
        }
    }
}
