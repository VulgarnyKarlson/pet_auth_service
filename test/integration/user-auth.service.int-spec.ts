import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'auth/application/services/auth.service';
import { UserService } from 'auth/application/services/user.service';
import { IUserRepository } from 'auth/domain/interfaces/user-repository.interface';
import { DatabaseService } from 'auth/infrastructure/database/database.service';
import { UserRepository } from 'auth/infrastructure/repository/user.repository';
import { AppConfig } from 'config/app.config';

describe('Auth Integration Tests', () => {
    let authService: AuthService;
    let userService: UserService;
    let userRepo: IUserRepository;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
                UserRepository,
                DatabaseService,
            ],
            imports: [
                JwtModule.register({
                    secret: AppConfig.JWT.authSecret,
                    signOptions: { expiresIn: AppConfig.JWT.accessExpiresIn },
                }),
            ],
        }).compile();

        authService = moduleFixture.get<AuthService>(AuthService);
        userService = moduleFixture.get<UserService>(UserService);
        userRepo = moduleFixture.get<IUserRepository>(UserRepository);

    });

    afterAll(async () => {
        await userRepo.cleanDatabase();
    });

    it('should sign up a new user', async () => {
        const registerDto = {
            email: 'test@test.com',
            username: 'testuser',
            password: 'password',
        };

        const tokens = await authService.signup(registerDto);
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
    });

    it('should sign in a user', async () => {
        const loginDto = {
            email: 'test@test.com',
            password: 'password',
        };

        const tokens = await authService.signin(loginDto);
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
    });

    it('should refresh tokens', async () => {
        const user = await userService.findByEmail('test@test.com');
        const tokens = await authService.getTokens(user.id, user.username);

        const refreshedTokens = await authService.refreshTokens(user.id, tokens.refreshToken);
        expect(refreshedTokens).toHaveProperty('accessToken');
        expect(refreshedTokens).toHaveProperty('refreshToken');
    });

    it('should log out a user', async () => {
        const user = await userService.findByEmail('test@test.com');

        const result = await authService.logout(user.id);
        expect(result).toBe(true);
    });
});
