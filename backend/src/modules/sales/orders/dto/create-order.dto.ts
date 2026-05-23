import {
    IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional,
    IsEnum, Min, IsUUID, ValidateIf, IsInt, IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoPago, TipoVivienda } from '@prisma/client';

export class OrderItemDto {
    @IsUUID()
    productId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;
}

export class TemporaryAddressDto {
    @IsString()
    @IsNotEmpty()
    calle!: string;

    @IsString()
    @IsNotEmpty()
    numero!: string;

    @IsOptional()
    @IsString()
    ciudad?: string;

    @IsOptional()
    @IsString()
    codigoPostal?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsEnum(TipoVivienda)
    tipoVivienda?: TipoVivienda;

    @IsOptional()
    @IsString()
    notas?: string;

    @IsUUID()
    comunaId!: string;

    @IsUUID()
    regionId!: string;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @ValidateIf(o => !o.direccion && o.direccionId)
    @IsUUID()
    direccionId?: string;

    @ValidateIf(o => !o.direccionId && o.direccion)
    @ValidateNested()
    @Type(() => TemporaryAddressDto)
    direccion?: TemporaryAddressDto;

    @IsEnum(MetodoPago)
    metodoPago!: MetodoPago;

    @IsString()
    @IsNotEmpty()
    metodoEnvio!: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    costoEnvio?: number;

    @IsOptional()
    @IsString()
    descuentoId?: string;

    @IsOptional()
    @IsString()
    notas?: string;
}