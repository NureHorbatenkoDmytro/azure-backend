import { Controller, Get, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { CreatePlantTypeDto, UpdatePlantTypeDto } from './dto';
import { PlantTypeService } from './plant-type.service';

@ApiBearerAuth()
@ApiTags('plant-types')
@Controller('plant-types')
export class PlantTypeController {
  constructor(private readonly plantTypeService: PlantTypeService) {}

  @ApiOperation({ summary: 'Get all plant types' })
  @Get()
  async getAll() {
    return this.plantTypeService.getAll();
  }

  @ApiOperation({ summary: 'Get plant type by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant type' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.plantTypeService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new plant type' })
  @ApiBody({ type: CreatePlantTypeDto })
  @Post()
  async create(@Body() createPlantTypeDto: CreatePlantTypeDto) {
    return this.plantTypeService.create(createPlantTypeDto);
  }

  @ApiOperation({ summary: 'Update a plant type' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant type' })
  @ApiBody({ type: UpdatePlantTypeDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlantTypeDto: UpdatePlantTypeDto) {
    return this.plantTypeService.update(id, updatePlantTypeDto);
  }

  @ApiOperation({ summary: 'Delete a plant type' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the plant type' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.plantTypeService.delete(id);
  }
}
