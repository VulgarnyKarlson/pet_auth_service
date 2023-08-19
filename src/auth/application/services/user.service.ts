import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { UserRepository } from 'auth/infrastructure/repository/user.repository';
import { User } from 'auth/domain/user.entity';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) {

    }

    public async create(email: string, username: string, password: string): Promise<User> {
        const hash = await argon.hash(password);
        return this.userRepository.create({
            email: email,
            username: username,
            hashAuth: hash,
        })
    }

    public findByEmail(email: string): Promise<User> {
        return this.userRepository.findByEmail(email);
    }

    public findById(id: string): Promise<User> {
        return this.userRepository.findById(id)
    }

    public async updateRefreshToken(userId: string, token: string): Promise<User> {
        const hash = await argon.hash(token);
        return this.userRepository.update(
            {
                id: userId,
            },
            {
                hashRefresh: hash,
            },
        );
    }

    public clearRefreshToken(userId: string): Promise<{ count: number }> {
        return this.userRepository.updateMany(
            {
                id: userId,
                hashRefresh: {
                    not: null,
                }
            },
            {
                hashRefresh: null,
            },
        );
    }
}
