import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'auth/api/controllers/auth.controller';
import { AuthGrpcController } from 'auth/api/controllers/auth-grpc.controller';
import { AuthService } from 'auth/application/services/auth.service';
import { UserService } from 'auth/application/services/user.service';
import { DatabaseModule } from 'auth/infrastructure/database/database.module';
import { UserRepository } from 'auth/infrastructure/repository/user.repository';
import { JwtRefreshStrategy } from 'auth/infrastructure/strategies/jwt-refresh.strategy';
import { JwtStrategy } from 'auth/infrastructure/strategies/jwt.strategy';

@Module({
    imports: [ JwtModule.register({}), DatabaseModule ],
    controllers: [ AuthController, AuthGrpcController ],
    providers: [
        AuthService, UserService,
        UserRepository,
        JwtStrategy, JwtRefreshStrategy,
    ],
})
export class AuthModule {}
