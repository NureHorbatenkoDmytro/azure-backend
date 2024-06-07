import { PartialType } from '@nestjs/swagger';

import { CreatePlantTypeDto } from './creat-plan-type.dto';

export class UpdatePlantTypeDto extends PartialType(CreatePlantTypeDto) {}
