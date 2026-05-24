import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @IsNotEmpty()
    primerNombre!: string;

    @IsString()
    @IsNotEmpty()
    primerApellido!: string;

    @IsOptional()
    @IsString()
    segundoNombre?: string;

    @IsOptional()
    @IsString()
    segundoApellido?: string;

}