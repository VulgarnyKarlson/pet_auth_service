import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime/library';
import { UserRepository } from 'auth/domain/interfaces/user-repository.interface';
import { DatabaseService } from 'auth/infrastructure/database/database.service';

@Injectable()
export class UserService {
    constructor(
        private db: DatabaseService,
    ) {

    }

    public async create(email: string, username: string, password: string): Promise<UserRepository> {
        const hash = await argon.hash(password);
        return this.db.user.create({
            data: {
                email: email,
                username: username,
                hashAuth: hash,
            },
        }).catch((error) => {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ForbiddenException('Credentials incorrect');
            }
            throw error;
        });
    }

    public findByEmail(email: string): Promise<UserRepository> {
        return this.db.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    public findById(id: string): Promise<UserRepository> {
        return this.db.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    public async updateRefreshToken(userId: string, token: string): Promise<UserRepository> {
        const hash = await argon.hash(token);
        return this.db.user.update({
            where: {
                id: userId,
            },
            data: {
                hashRefresh: hash,
            },
        });
    }

    public clearRefreshToken(userId: string): Promise<{ count: number }> {
        return this.db.user.updateMany({
            where: {
                id: userId,
                hashRefresh: {
                    not: null,
                }
            },
            data: {
                hashRefresh: null,
            },
        });
    }
}
