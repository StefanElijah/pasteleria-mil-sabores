import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    slug!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    descripcion?: string;

    @IsOptional()
    @IsString()
    padreId?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => parseInt(value, 10) || 0)
    ordenVisual?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    activo?: boolean;
}
