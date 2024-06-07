import { PartialType } from '@nestjs/swagger';

import { CreatePlantDataDto } from './create-plant-data.dto';

export class UpdatePlantDataDto extends PartialType(CreatePlantDataDto) {}
