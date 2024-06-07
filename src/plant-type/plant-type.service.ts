import { Injectable } from '@nestjs/common';

import { CreatePlantTypeDto, UpdatePlantTypeDto } from './dto';

import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PlantTypeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.plantType.findMany();
  }

  async getById(id: string) {
    return this.prisma.plantType.findUnique({ where: { id } });
  }

  async create(data: CreatePlantTypeDto) {
    return this.prisma.plantType.create({ data });
  }

  async update(id: string, data: UpdatePlantTypeDto) {
    return this.prisma.plantType.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.plantType.delete({ where: { id } });
  }
}
