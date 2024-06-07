import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guargs/jwt-auth.guard';
import { BackupModule } from './backup/backup.module';
import { PlantModule } from './plant/plant.module';
import { PlantDataModule } from './plant-data/plant-data.module';
import { PlantTypeModule } from './plant-type/plant-type.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import {
  IsPlantExistsConstraint,
  IsPlantTypeExistsConstraint,
  IsUserExistsConstraint,
} from './validators';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    PlantModule,
    PlantTypeModule,
    PlantDataModule,
    BackupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    IsPlantExistsConstraint,
    IsPlantTypeExistsConstraint,
    IsUserExistsConstraint,
  ],
})
export class AppModule {}
