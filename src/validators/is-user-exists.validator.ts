import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { validate as isUUID } from 'uuid';

import { PrismaService } from '@prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(userId: string) {
    if (!isUUID(userId)) {
      return false;
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    const userId = args.value;
    if (!isUUID(userId)) {
      return `User with ID ${userId} is not a valid UUID`;
    }
    return `User with ID ${userId} does not exist`;
  }
}

export function IsUserExists(validationOptions?: ValidationOptions) {
  console.log('asdasd');
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExistsConstraint,
    });
  };
}
