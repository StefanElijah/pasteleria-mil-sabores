import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateDraftDto {
    @IsOptional()
    @IsObject()
    recipient?: Record<string, any>;

    @IsOptional()
    @IsObject()
    address?: Record<string, any>;

    @IsOptional()
    @IsString()
    shippingMethod?: string;

    @IsOptional()
    @IsString()
    paymentMethod?: string;
}
