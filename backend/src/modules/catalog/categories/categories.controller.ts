import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ParseCuidPipe } from '../../../lib/parse-cuid.pipe';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch('reordenar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    reordenar(@Body() ordenes: { id: string; ordenVisual: number }[]) {
        return this.categoriesService.reordenar(ordenes);
    }

    @Get()
    findAll(@Query('activo') activo?: string, @Query('includeProducts') includeProducts?: string) {
        const withProducts = includeProducts === 'true';
        if (activo === 'all') {
            return this.categoriesService.findAll(null, withProducts);
        }
        const isActive = activo === 'true' ? true : activo === 'false' ? false : undefined;
        return this.categoriesService.findAll(isActive, withProducts);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Get(':id')
    findOne(@Param('id', ParseCuidPipe) id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id', ParseCuidPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseCuidPipe) id: string) {
        return this.categoriesService.remove(id);
    }
}