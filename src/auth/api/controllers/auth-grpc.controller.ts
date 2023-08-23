import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ValidateTokenRequestDto, ValidateTokenResponseDto } from 'auth/application/dtos/validateToken.dto';
import { AuthService } from 'auth/application/services/auth.service';

@Controller()
export class AuthGrpcController {
    constructor(
        private authService: AuthService,
    ) {}

    @GrpcMethod('AuthService', 'ValidateToken')
    async validateToken(data: ValidateTokenRequestDto): Promise<ValidateTokenResponseDto> {
        const jwtDto = await this.authService.validateAuthToken(data.token);
        if (jwtDto === null) {
            return {
                valid: false,
            }
        }

        return {
            valid: true,
            user: {
                id: jwtDto.sub,
                username: jwtDto.username,
            }
        };
    }
}
