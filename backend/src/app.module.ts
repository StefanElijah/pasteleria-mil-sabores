import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from '@modules/catalog/products/products.module';
import { CategoriesModule } from '@modules/catalog/categories/categories.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from '@modules/sales/cart/cart.module';
import { RegionesModule } from './modules/locations/regiones/regiones.module';
import { ComunasModule } from './modules/locations/comunas/comunas.module';
import { AddressesModule } from '@modules/sales/addresses/addresses.module';
import { OrdersModule } from '@modules/sales/orders/orders.module';
import { ShippingModule } from '@modules/sales/shipping/shipping.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CheckoutModule } from '@modules/sales/checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    ComunasModule,
    RegionesModule,
    AddressesModule,
    OrdersModule,
    ShippingModule,
    CloudinaryModule,
    CheckoutModule
  ],
})
export class AppModule { }