import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ParseCuidPipe } from '../../../lib/parse-cuid.pipe';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(@Query('activo') activo?: string) {
        // Si no se especifica activo, devolver solo activos (público)
        if (!activo) {
            return this.productsService.findAll(true); // solo activos
        }
        // Si se especifica 'all' o 'false', devolver todos
        if (activo === 'all' || activo === 'false') {
            return this.productsService.findAll(false); // incluir inactivos
        }
        // Si se especifica 'true', devolver solo activos
        return this.productsService.findAll(true);
    }

    @Get('destacados')
    findFeatured() {
        return this.productsService.findFeatured();
    }

    @Get('novedades')
    findNew() {
        return this.productsService.findAll();
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Get(':id')
    findOne(@Param('id', ParseCuidPipe) id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id', ParseCuidPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseCuidPipe) id: string) {
        return this.productsService.remove(id);
    }
}