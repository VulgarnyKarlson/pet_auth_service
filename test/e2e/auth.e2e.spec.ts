import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { RegisterDto } from 'auth/application/dtos/register.dto';
import { AuthService } from 'auth/application/services/auth.service';
import { AppModule } from 'app.module';
import { DatabaseService } from 'auth/infrastructure/database/database.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let dbService: DatabaseService;
    let httpClient: supertest.SuperTest<supertest.Test>;

    const testUser = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'testpassword',
    };



    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ AppModule ],
        }).compile();

        app = moduleFixture.createNestApplication();
        dbService = moduleFixture.get<DatabaseService>(DatabaseService);
        authService = moduleFixture.get<AuthService>(AuthService);
        await app.init();

        await dbService.cleanDatabase();
        httpClient = supertest(app.getHttpServer());
    });

    afterAll(async () => {
        await dbService.cleanDatabase();
        await dbService.$disconnect();
        await app.close();
    });

    it('/signup (POST)', async () => {
        const response = await httpClient
            .post('/signup')
            .send({
                email: testUser.email,
                username: testUser.username,
                password: testUser.password,
            })
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                expect(res.body).toHaveProperty('accessToken');
                expect(res.body).toHaveProperty('refreshToken');
            });

        const user = await authService.signin({
            email: testUser.email,
            password: testUser.password,
        })

        expect(user).toHaveProperty('accessToken');
        expect(user).toHaveProperty('refreshToken');

        return response;
    });
    it('/signin (POST)', async () => {
        await authService.signup({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
        } as RegisterDto);


        return httpClient
            .post('/signin')
            .send({
                email: testUser.email,
                password: testUser.password,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body).toHaveProperty('accessToken');
                expect(res.body).toHaveProperty('refreshToken');
            });
    });

    it('/logout (POST)', async () => {
        const tokens = await authService.signup({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
        });

        return httpClient
            .post('/logout')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .expect(HttpStatus.OK);
    });

    it('/refresh (POST)', async () => {
        const tokens = await authService.signup({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
        });

        return httpClient
            .post('/refresh')
            .set('Authorization', `Bearer ${tokens.refreshToken}`)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body).toHaveProperty('accessToken');
                expect(res.body).toHaveProperty('refreshToken');
            });
    });

});
