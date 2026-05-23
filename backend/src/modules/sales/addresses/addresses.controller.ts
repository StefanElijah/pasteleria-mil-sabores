import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    create(@Req() req: any, @Body() createAddressDto: CreateAddressDto) {
        return this.addressesService.create(req.user.userId, createAddressDto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.addressesService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.addressesService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Req() req: any, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressesService.update(id, req.user.userId, updateAddressDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.addressesService.remove(id, req.user.userId);
    }
}