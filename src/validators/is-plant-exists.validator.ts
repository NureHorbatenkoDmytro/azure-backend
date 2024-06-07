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
export class IsPlantExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(plantId: string) {
    if (!isUUID(plantId)) {
      return false;
    }
    const plant = await this.prisma.plant.findUnique({ where: { id: plantId } });
    return !!plant;
  }

  defaultMessage(args: ValidationArguments) {
    const plantId = args.value;
    if (!isUUID(plantId)) {
      return `Plant with ID ${plantId} is not a valid UUID`;
    }
    return `Plant with ID ${plantId} does not exist`;
  }
}

export function IsPlantExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPlantExistsConstraint,
    });
  };
}
