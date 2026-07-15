import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/, {
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número. Sin espacios.',
    })
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