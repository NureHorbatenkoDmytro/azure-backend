import { Controller, Get, Post, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CreatePlantDataDto, UpdatePlantDataDto } from './dto';
import { PlantDataService } from './plant-data.service';

import { RolesGuard } from '@auth/guargs/role.guard';
import { Roles } from '@common/decorators';

@ApiBearerAuth()
@ApiTags('plant-data')
@Controller('plant-data')
@UseGuards(RolesGuard)
export class PlantDataController {
  constructor(private readonly plantDataService: PlantDataService) {}

  @ApiOperation({ summary: 'Get all data for a plant' })
  @ApiParam({ name: 'plantId', required: true, description: 'ID of the plant' })
  @Get(':plantId')
  @Roles(Role.ADMIN, Role.SENSOR)
  async getAllByPlant(@Param('plantId') plantId: string) {
    return this.plantDataService.getAllByPlant(plantId);
  }

  @ApiOperation({ summary: 'Get data by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the data entry' })
  @Get(':id')
  @Roles(Role.ADMIN, Role.SENSOR)
  async getById(@Param('id') id: string) {
    return this.plantDataService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new data entry' })
  @ApiBody({ type: CreatePlantDataDto })
  @Post()
  @Roles(Role.ADMIN, Role.SENSOR)
  async create(@Body() createPlantDataDto: CreatePlantDataDto) {
    return this.plantDataService.create(createPlantDataDto);
  }

  @ApiOperation({ summary: 'Update a data entry' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the data entry' })
  @ApiBody({ type: UpdatePlantDataDto })
  @Patch(':id')
  @Roles(Role.ADMIN, Role.SENSOR)
  async update(@Param('id') id: string, @Body() updatePlantDataDto: UpdatePlantDataDto) {
    return this.plantDataService.update(id, updatePlantDataDto);
  }

  @ApiOperation({ summary: 'Delete a data entry' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the data entry' })
  @Delete(':id')
  @Roles(Role.ADMIN, Role.SENSOR)
  async delete(@Param('id') id: string) {
    return this.plantDataService.delete(id);
  }

  @ApiOperation({ summary: 'Get average parameters' })
  @Get('average/:plantId')
  async getAverageParameters(@Param('plantId') plantId: string) {
    return this.plantDataService.getAverageParameters(plantId);
  }

  @ApiOperation({ summary: 'Get parameter trends' })
  @Get('trends/:plantId')
  async getParameterTrends(@Param('plantId') plantId: string) {
    return this.plantDataService.getParameterTrends(plantId);
  }

  @ApiOperation({ summary: 'Get parameter correlations' })
  @Get('correlations/:plantId')
  async getParameterCorrelations(@Param('plantId') plantId: string) {
    return this.plantDataService.getParameterCorrelations(plantId);
  }
}
