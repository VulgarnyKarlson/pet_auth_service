import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly username: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string

}
