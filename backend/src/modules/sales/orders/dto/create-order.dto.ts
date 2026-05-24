import {
    IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional,
    IsEnum, Min, IsUUID, ValidateIf, IsInt, IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoPago, TipoVivienda } from '@prisma/client';

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
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
    telefono?: string;

    @IsOptional()
    @IsEnum(TipoVivienda)
    tipoVivienda?: TipoVivienda;

    @IsOptional()
    @IsString()
    notas?: string;

    @IsString()
    @IsNotEmpty()
    comunaId!: string;
}

export class CreateOrderDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items?: OrderItemDto[];

    @ValidateIf(o => !o.direccion && o.direccionId)
    @IsString()
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

    // Campos obligatorios del destinatario (siempre los envía el frontend)
    @IsString()
    @IsNotEmpty()
    primerNombreDestinatario!: string;

    @IsString()
    @IsNotEmpty()
    primerApellidoDestinatario!: string;

    @IsEmail()
    @IsNotEmpty()
    emailDestinatario!: string;

    @IsString()
    @IsNotEmpty()
    telefonoDestinatario!: string;

    // Campos opcionales para pasarela de pago
    @IsOptional()
    @IsString()
    transaccionId?: string;

    @IsOptional()
    @IsString()
    comprobantePago?: string;
}