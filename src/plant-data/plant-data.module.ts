import { Module } from '@nestjs/common';

import { PlantDataController } from './plant-data.controller';
import { PlantDataService } from './plant-data.service';

@Module({
  controllers: [PlantDataController],
  providers: [PlantDataService],
})
export class PlantDataModule {}
