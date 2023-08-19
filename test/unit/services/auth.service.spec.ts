import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import argon from 'argon2';
import { LoginDto } from 'auth/application/dtos/login.dto';
import { RegisterDto } from 'auth/application/dtos/register.dto';
import { UserService } from 'auth/application/services/user.service';
import { User } from 'auth/domain/user.entity';
import { AuthService } from 'auth/application/services/auth.service';

const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'password',
    email: 'test@test.com',
    hashAuth: 'hashedpassword',
    hashRefresh: 'hashedrefresh',
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2022-01-02T00:00:00Z'),
};

beforeAll(async () => {
    mockUser.hashAuth = await argon.hash(mockUser.password);
});

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn(),
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        updateRefreshToken: jest.fn(),
                        clearRefreshToken: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                        verifyAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should sign up a user', async () => {
        const registerDto: RegisterDto = {
            email: mockUser.email,
            username: mockUser.username,
            password: 'password',
        }
        const user: User = mockUser;
        const tokens = {
            accessToken: 'token',
            refreshToken: 'token',
        };

        jest.spyOn(userService, 'create').mockResolvedValue(user);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

        expect(await service.signup(registerDto)).toEqual(tokens);
    });

    it('should sign in a user', async () => {
        const loginDto: LoginDto = {
            email: mockUser.email,
            password: mockUser.password,
        }
        const user: User = mockUser;
        const tokens = {
            accessToken: 'token',
            refreshToken: 'token',
        };

        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

        expect(await service.signin(loginDto)).toEqual(tokens);
    });

    it('should refresh tokens', async () => {
        const refreshToken = 'refresh-token';
        const user: User = mockUser;
        const newTokens = {
            accessToken: 'new-token',
            refreshToken: 'new-token',
        };
        user.hashRefresh = await argon.hash(refreshToken);

        jest.spyOn(userService, 'findById').mockResolvedValue(user);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('new-token');


        expect(await service.refreshTokens(user.id, refreshToken)).toEqual(newTokens);
    });

    it('should validate auth token', async () => {
        const userId = '1';
        const user: User = mockUser;

        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(user);

        expect(await service.validateAuthToken(userId)).toEqual(user);
    });
});
