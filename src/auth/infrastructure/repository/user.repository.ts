import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime/library';
import { AppConfig } from 'config/app.config';
import { CreateUserDto } from 'auth/application/dtos/create-user.dto';
import {
    IUserRepository,
    UserWhereInput,
    UserWhereUniqueInput
} from 'auth/domain/interfaces/user-repository.interface';
import { User } from 'auth/domain/user.entity';
import { DatabaseService } from 'auth/infrastructure/database/database.service';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const { email, hashAuth, username } = userDto;

        return this.databaseService.user.create({
            data: {
                email,
                hashAuth,
                username,
            },
        }).catch((error) => {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ForbiddenException('Credentials incorrect');
            }
            throw error;
        });
    }

    async findByEmail(email: string) {
        return this.databaseService.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findById(id: string) {
        return this.databaseService.user.findUnique({
            where: {
                id,
            },
        });
    }

    async update(where: UserWhereUniqueInput, data: Partial<User>) {
        return this.databaseService.user.update({
            where,
            data,
        });
    }

    async updateMany(where: UserWhereInput, data: Partial<User>) {
        return this.databaseService.user.updateMany({
            where,
            data,
        });
    }

    async cleanDatabase() {
        if (AppConfig.IS_PRODUCTION) {
            return;
        }

        await this.databaseService.user.deleteMany();
    }
}
