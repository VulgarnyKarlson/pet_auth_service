import { User } from 'auth/domain/user.entity';

export class CreateUserDto implements Partial<User> {
    readonly email: string;
    readonly username: string;
    readonly hashAuth: string;
}
