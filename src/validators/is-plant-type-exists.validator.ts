import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { validate as isUUID } from 'uuid';

import { PrismaService } from '@prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPlantTypeExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(plantTypeId: string) {
    if (!isUUID(plantTypeId)) {
      return false;
    }
    const plantType = await this.prisma.plantType.findUnique({ where: { id: plantTypeId } });
    return !!plantType;
  }

  defaultMessage(args: ValidationArguments) {
    const plantTypeId = args.value;
    if (!isUUID(plantTypeId)) {
      return `PlantType with ID ${plantTypeId} is not a valid UUID`;
    }
    return `PlantType with ID ${plantTypeId} does not exist`;
  }
}

export function IsPlantTypeExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPlantTypeExistsConstraint,
    });
  };
}
