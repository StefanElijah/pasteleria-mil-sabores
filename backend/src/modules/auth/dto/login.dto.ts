import { IsEmail, IsOptional, IsBoolean, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    password: string;

    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}
