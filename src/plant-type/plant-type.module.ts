import { Module } from '@nestjs/common';

import { PlantTypeController } from './plant-type.controller';
import { PlantTypeService } from './plant-type.service';

@Module({
  controllers: [PlantTypeController],
  providers: [PlantTypeService],
})
export class PlantTypeModule {}
