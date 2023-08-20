import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { AuthGrpcController } from 'auth/api/controllers/auth-grpc.controller';
import { AuthService } from 'auth/application/services/auth.service';
import { UserService } from 'auth/application/services/user.service';
import { UserRepository } from 'auth/infrastructure/repository/user.repository';
import { DatabaseService } from 'auth/infrastructure/database/database.service';
import { AppConfig } from 'config/app.config';

describe('AuthGrpcController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let authGrpcController: AuthGrpcController;
    let userRepository: UserRepository;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: AppConfig.JWT.authSecret,
                    signOptions: { expiresIn: AppConfig.JWT.accessExpiresIn },
                }),
            ],
            controllers: [ AuthGrpcController ],
            providers: [
                AuthService,
                UserService,
                UserRepository,
                DatabaseService,
                JwtService,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        authGrpcController = moduleFixture.get<AuthGrpcController>(AuthGrpcController);
        authService = moduleFixture.get<AuthService>(AuthService);
        userRepository = moduleFixture.get<UserRepository>(UserRepository);


        await app.init();
        await userRepository.cleanDatabase();
    });

    afterAll(async () => {
        await userRepository.cleanDatabase();
        await app.close();
    });

    describe('validateToken', () => {
        it('should return user details for a valid token', async () => {
            const userDto = { email: 'test@test.com', username: 'test', password: 'test123' };
            const tokens = await authService.signup(userDto);
            const userDetails = await authGrpcController.validateToken({ token: tokens.accessToken });

            expect(userDetails).toHaveProperty('id');
            expect(userDetails).toHaveProperty('username');
            expect(userDetails.username).toBe(userDto.username);
        });

        it('should return null for an invalid token', async () => {
            const result = await authGrpcController.validateToken({ token: 'invalidToken' });
            expect(result).toBeNull();
        });
    });
});
