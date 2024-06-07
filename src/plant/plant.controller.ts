import { Controller, Get, Post, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CreatePlantDto, UpdatePlantDto } from './dto';
import { PlantService } from './plant.service';

import { RolesGuard } from '@auth/guargs/role.guard';
import { JwtPayload } from '@auth/interfaces';
import { CurrentUser, Roles } from '@common/decorators';

@ApiBearerAuth()
@ApiTags('plants')
@Controller('plants')
@UseGuards(RolesGuard)
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @ApiOperation({ summary: 'Get all plants' })
  @Get()
  @Roles(Role.ADMIN)
  async getAll() {
    return this.plantService.getAll();
  }

  @ApiOperation({ summary: 'Get my plants' })
  @Get('my')
  async getMy(@CurrentUser() user: JwtPayload) {
    return this.plantService.getMy(user.id);
  }

  @ApiOperation({ summary: 'Get plant by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant' })
  @Get(':id')
  @Roles(Role.ADMIN)
  async getById(@Param('id') id: string) {
    return this.plantService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new plant' })
  @ApiBody({ type: CreatePlantDto })
  @Post()
  async create(@Body() createPlantDto: CreatePlantDto, @CurrentUser() user: JwtPayload) {
    return this.plantService.create(createPlantDto, user.id);
  }

  @ApiOperation({ summary: 'Update a plant' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant' })
  @ApiBody({ type: UpdatePlantDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlantDto: UpdatePlantDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.plantService.update(id, updatePlantDto, user.id);
  }

  @ApiOperation({ summary: 'Delete a plant' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.plantService.delete(id);
  }
}
