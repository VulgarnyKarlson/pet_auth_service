import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'auth/application/services/user.service';
import { User } from 'auth/domain/user.entity';
import { UserRepository } from 'auth/infrastructure/repository/user.repository';
import { DatabaseService } from 'auth/infrastructure/database/database.service';

const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@test.com',
    hashAuth: 'hashedpassword',
    hashRefresh: 'hashedrefresh',
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2022-01-02T00:00:00Z'),
};

describe('UserService', () => {
    let userService: UserService;
    let mockDatabaseService: Partial<DatabaseService>;
    let mockUserRepository: Partial<UserRepository>;

    beforeEach(async () => {
        mockDatabaseService = {};

        mockUserRepository = {
            create: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn().mockResolvedValue(mockUser),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            updateMany: jest.fn().mockResolvedValue(undefined),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        const user = await userService.create('test@mail.com', 'testuser', 'password');
        expect(user).toHaveProperty('id', '1');
    });

    it('should find a user by email', async () => {
        const user: User = mockUser;
        jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user);

        expect(await userService.findByEmail('test@test.com')).toEqual(user);
    });

    it('should not find a user by email', async () => {
        jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null);

        expect(await userService.findByEmail('test2@test.com')).toBeNull();
    })

    it('should find a user by id', async () => {
        const user: User = mockUser;
        jest.spyOn(mockUserRepository, 'findById').mockResolvedValue(user);

        expect(await userService.findById('1')).toEqual(user);
    });

    it('should update the refresh token for a user', async () => {
        const user: User = mockUser;
        const newRefreshToken = 'new-refresh-token';

        jest.spyOn(mockUserRepository, 'update').mockResolvedValue(user);

        expect(await userService.updateRefreshToken(user.id, newRefreshToken)).toEqual(user);
    });

    it('should clear the refresh token for a user', async () => {
        const userId = '1';

        jest.spyOn(mockUserRepository, 'updateMany').mockResolvedValue(undefined);

        expect(await userService.clearRefreshToken(userId)).toBeUndefined();
    });
});
