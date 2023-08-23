import { User } from 'auth/domain/user.entity';

export interface ValidateTokenRequestDto {
    token: string;
}

export interface ValidateTokenResponseDto {
    valid: boolean;
    user?: Pick<User, 'id'|'username'>;
}
