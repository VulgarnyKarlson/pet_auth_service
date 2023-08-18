import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from 'auth/application/services/auth.service';
import { UserRepository } from 'auth/domain/interfaces/user-repository.interface';

@Controller()
export class AuthGrpcController {
    constructor(
        private authService: AuthService,
    ) {}

    @GrpcMethod('AuthService', 'ValidateToken')
    async validateToken(data: { token: string }): Promise<Pick<UserRepository, 'id'|'username'>> {
        const jwtDto = await this.authService.validateAuthToken(data.token);
        if (jwtDto === null) {
            return null;
        }

        return {
            id: jwtDto.sub,
            username: jwtDto.username,
        };
    }
}
