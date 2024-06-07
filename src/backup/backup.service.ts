import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

import * as fs from 'fs';
import * as path from 'path';

import { BackupDto } from './dto/backup.dto';

import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  async createBackup(): Promise<BackupDto> {
    const users = await this.prisma.user.findMany({
      include: {
        Token: true,
        plants: {
          include: {
            data: true,
            type: true,
          },
        },
      },
    });

    const plantTypes = await this.prisma.plantType.findMany();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.resolve('backups', timestamp);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const userWriter = createObjectCsvWriter({
      path: path.join(backupDir, `users.csv`),
      header: [
        { id: 'id', title: 'id' },
        { id: 'email', title: 'email' },
        { id: 'password', title: 'password' },
        { id: 'provider', title: 'provider' },
        { id: 'createdAt', title: 'createdAt' },
        { id: 'updatedAt', title: 'updatedAt' },
        { id: 'roles', title: 'roles' },
        { id: 'isBlocked', title: 'isBlocked' },
      ],
    });

    const userRecords = users.map((user) => ({
      id: user.id,
      email: user.email,
      password: user.password,
      provider: user.provider || '',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      roles: user.roles.join(' '),
      isBlocked: user.isBlocked,
    }));

    await userWriter.writeRecords(userRecords);

    const tokenWriter = createObjectCsvWriter({
      path: path.join(backupDir, `tokens.csv`),
      header: [
        { id: 'token', title: 'token' },
        { id: 'exp', title: 'exp' },
        { id: 'userId', title: 'userId' },
        { id: 'userAgent', title: 'userAgent' },
      ],
    });

    const tokenRecords = users.flatMap((user) =>
      user.Token.map((token) => ({
        token: token.token,
        exp: token.exp.toISOString(),
        userId: user.id,
        userAgent: token.userAgent,
      })),
    );

    await tokenWriter.writeRecords(tokenRecords);

    const plantWriter = createObjectCsvWriter({
      path: path.join(backupDir, `plants.csv`),
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'plantTypeId', title: 'plantTypeId' },
        { id: 'userId', title: 'userId' },
        { id: 'plantingDate', title: 'plantingDate' },
        { id: 'currentStatus', title: 'currentStatus' },
        { id: 'soilType', title: 'soilType' },
      ],
    });

    const plantRecords = users.flatMap((user) =>
      user.plants.map((plant) => ({
        id: plant.id,
        name: plant.name,
        plantTypeId: plant.plantTypeId,
        userId: user.id,
        plantingDate: plant.plantingDate.toISOString(),
        currentStatus: plant.currentStatus,
        soilType: plant.soilType,
      })),
    );

    await plantWriter.writeRecords(plantRecords);

    const dataWriter = createObjectCsvWriter({
      path: path.join(backupDir, `data.csv`),
      header: [
        { id: 'id', title: 'id' },
        { id: 'humidity', title: 'humidity' },
        { id: 'temperature', title: 'temperature' },
        { id: 'light', title: 'light' },
        { id: 'nutrientLevel', title: 'nutrientLevel' },
        { id: 'plantId', title: 'plantId' },
        { id: 'timestamp', title: 'timestamp' },
      ],
    });

    const dataRecords = users.flatMap((user) =>
      user.plants.flatMap((plant) =>
        plant.data.map((data) => ({
          id: data.id,
          humidity: data.humidity,
          temperature: data.temperature,
          light: data.light,
          nutrientLevel: data.nutrientLevel,
          plantId: plant.id,
          timestamp: data.timestamp.toISOString(),
        })),
      ),
    );

    await dataWriter.writeRecords(dataRecords);

    const plantTypeWriter = createObjectCsvWriter({
      path: path.join(backupDir, `plantTypes.csv`),
      header: [
        { id: 'id', title: 'id' },
        { id: 'typeName', title: 'typeName' },
        { id: 'description', title: 'description' },
        { id: 'optimalHumidity', title: 'optimalHumidity' },
        { id: 'optimalTemperature', title: 'optimalTemperature' },
        { id: 'optimalLight', title: 'optimalLight' },
      ],
    });

    const plantTypeRecords = plantTypes.map((plantType) => ({
      id: plantType.id,
      typeName: plantType.typeName,
      description: plantType.description,
      optimalHumidity: plantType.optimalHumidity,
      optimalTemperature: plantType.optimalTemperature,
      optimalLight: plantType.optimalLight,
    }));

    await plantTypeWriter.writeRecords(plantTypeRecords);

    const backupDto = new BackupDto();
    backupDto.fileName = timestamp;

    return backupDto;
  }

  async restoreBackup(folderName: string): Promise<void> {
    const backupDir = path.resolve('backups', folderName);

    const parseCSV = (filePath: string) => {
      return new Promise<any[]>((resolve, reject) => {
        const records: any[] = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => records.push(data))
          .on('end', () => resolve(records))
          .on('error', reject);
      });
    };

    const userRecords = await parseCSV(path.join(backupDir, 'users.csv'));
    for (const record of userRecords) {
      const { id, email, password, provider, createdAt, updatedAt, roles, isBlocked } = record;
      await this.prisma.user.upsert({
        where: { id },
        update: {
          email,
          password,
          provider: provider || null,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
          roles: roles.split(' ') as Role[],
          isBlocked: isBlocked === 'true',
        },
        create: {
          id,
          email,
          password,
          provider: provider || null,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
          roles: roles.split(' ') as Role[],
          isBlocked: isBlocked === 'true',
        },
      });
    }

    const tokenRecords = await parseCSV(path.join(backupDir, 'tokens.csv'));
    for (const record of tokenRecords) {
      const { token, exp, userId, userAgent } = record;
      await this.prisma.token.upsert({
        where: { token },
        update: {
          exp: new Date(exp),
          userId,
          userAgent,
        },
        create: {
          token,
          exp: new Date(exp),
          userId,
          userAgent,
        },
      });
    }

    const plantRecords = await parseCSV(path.join(backupDir, 'plants.csv'));
    for (const record of plantRecords) {
      const { id, name, plantTypeId, userId, plantingDate, currentStatus, soilType } = record;
      await this.prisma.plant.upsert({
        where: { id },
        update: {
          name,
          plantTypeId,
          userId,
          plantingDate: new Date(plantingDate),
          currentStatus,
          soilType,
        },
        create: {
          id,
          name,
          plantTypeId,
          userId,
          plantingDate: new Date(plantingDate),
          currentStatus,
          soilType,
        },
      });
    }

    const dataRecords = await parseCSV(path.join(backupDir, 'data.csv'));
    for (const record of dataRecords) {
      const { id, humidity, temperature, light, nutrientLevel, plantId, timestamp } = record;
      await this.prisma.data.upsert({
        where: { id },
        update: {
          humidity: parseFloat(humidity),
          temperature: parseFloat(temperature),
          light: parseFloat(light),
          nutrientLevel: parseFloat(nutrientLevel),
          plantId,
          timestamp: new Date(timestamp),
        },
        create: {
          id,
          humidity: parseFloat(humidity),
          temperature: parseFloat(temperature),
          light: parseFloat(light),
          nutrientLevel: parseFloat(nutrientLevel),
          plantId,
          timestamp: new Date(timestamp),
        },
      });
    }

    const plantTypeRecords = await parseCSV(path.join(backupDir, 'plantTypes.csv'));
    for (const record of plantTypeRecords) {
      const { id, typeName, description, optimalHumidity, optimalTemperature, optimalLight } =
        record;
      await this.prisma.plantType.upsert({
        where: { id },
        update: {
          typeName,
          description,
          optimalHumidity: parseFloat(optimalHumidity),
          optimalTemperature: parseFloat(optimalTemperature),
          optimalLight: parseFloat(optimalLight),
        },
        create: {
          id,
          typeName,
          description,
          optimalHumidity: parseFloat(optimalHumidity),
          optimalTemperature: parseFloat(optimalTemperature),
          optimalLight: parseFloat(optimalLight),
        },
      });
    }
  }
}
