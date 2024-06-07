import { Injectable } from '@nestjs/common';

import { CreatePlantDataDto, UpdatePlantDataDto } from './dto';
import { Trend, TrendResult } from './entities';

import { PrismaService } from '@prisma/prisma.service';
@Injectable()
export class PlantDataService {
  constructor(private prisma: PrismaService) {}

  async getAllByPlant(plantId: string) {
    return this.prisma.data.findMany({ where: { plantId } });
  }

  async getById(id: string) {
    return this.prisma.data.findUnique({ where: { id } });
  }

  async create(data: CreatePlantDataDto) {
    return this.prisma.data.create({ data });
  }

  async update(id: string, data: UpdatePlantDataDto) {
    return this.prisma.data.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.data.delete({ where: { id } });
  }

  async getAverageParameters(plantId: string) {
    const data = await this.prisma.data.findMany({
      where: {
        plantId,
      },
    });

    const totals = {
      humidity: 0,
      temperature: 0,
      light: 0,
      nutrientLevel: 0,
    };

    for (const entry of data) {
      totals.humidity += entry.humidity;
      totals.temperature += entry.temperature;
      totals.light += entry.light;
      totals.nutrientLevel += entry.nutrientLevel;
    }

    const count = data.length;

    return {
      avgHumidity: count ? totals.humidity / count : 0,
      avgTemperature: count ? totals.temperature / count : 0,
      avgLight: count ? totals.light / count : 0,
      avgNutrientLevel: count ? totals.nutrientLevel / count : 0,
    };
  }

  async getParameterTrends(plantId: string): Promise<TrendResult[]> {
    const data = await this.prisma.data.findMany({
      where: {
        plantId,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    const trends: Record<string, Trend> = {};

    for (const entry of data) {
      const timestamp = entry.timestamp.toISOString().split('T')[0];

      if (!trends[timestamp]) {
        trends[timestamp] = {
          humidity: 0,
          temperature: 0,
          light: 0,
          nutrientLevel: 0,
          count: 0,
        };
      }

      trends[timestamp].humidity += entry.humidity;
      trends[timestamp].temperature += entry.temperature;
      trends[timestamp].light += entry.light;
      trends[timestamp].nutrientLevel += entry.nutrientLevel;
      trends[timestamp].count += 1;
    }

    return Object.entries(trends).map(([timestamp, values]) => ({
      timestamp,
      avgHumidity: values.humidity / values.count,
      avgTemperature: values.temperature / values.count,
      avgLight: values.light / values.count,
      avgNutrientLevel: values.nutrientLevel / values.count,
    }));
  }

  async getParameterCorrelations(plantId: string) {
    const data = await this.prisma.data.findMany({
      where: {
        plantId,
      },
    });

    const correlationMatrix = {
      humidityTemperature: this.calculateCorrelation(data, 'humidity', 'temperature'),
      humidityLight: this.calculateCorrelation(data, 'humidity', 'light'),
      temperatureLight: this.calculateCorrelation(data, 'temperature', 'light'),
      humidityNutrientLevel: this.calculateCorrelation(data, 'humidity', 'nutrientLevel'),
      temperatureNutrientLevel: this.calculateCorrelation(data, 'temperature', 'nutrientLevel'),
      lightNutrientLevel: this.calculateCorrelation(data, 'light', 'nutrientLevel'),
    };

    return correlationMatrix;
  }

  private calculateCorrelation(data: any[], param1: string, param2: string): number {
    const n = data.length;
    const sum1 = data.reduce((sum, entry) => sum + entry[param1], 0);
    const sum2 = data.reduce((sum, entry) => sum + entry[param2], 0);
    const sum1Sq = data.reduce((sum, entry) => sum + entry[param1] ** 2, 0);
    const sum2Sq = data.reduce((sum, entry) => sum + entry[param2] ** 2, 0);
    const pSum = data.reduce((sum, entry) => sum + entry[param1] * entry[param2], 0);

    const num = pSum - (sum1 * sum2) / n;
    const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n));

    if (den === 0) return 0;
    return num / den;
  }
}
