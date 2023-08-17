import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { getUserDecorator } from 'auth/api/decorators/get-user.decorator';
import { JwtAuthGuard } from 'auth/api/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'auth/api/guards/jwt-refresh.guard';
import { LoginDto } from 'auth/application/dtos/login.dto';
import { RegisterDto } from 'auth/application/dtos/register.dto';
import { AuthService } from 'auth/application/services/auth.service';
import { JwtAuthPayload, JwtRefreshPayload } from 'auth/domain/security/jwt-payload.interfaces';

@Controller('/')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}


    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() dto: RegisterDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() dto: LoginDto) {
        return this.authService.signin(dto);
    }


    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(
        @getUserDecorator() user: JwtAuthPayload
    ) {
        return this.authService.logout(user.sub);
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(
        @getUserDecorator() user: JwtRefreshPayload,
    ) {
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }
}
