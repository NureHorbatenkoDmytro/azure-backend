import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { UserResponse } from './responses';
import { UserService } from './user.service';

import { RolesGuard } from '@auth/guargs/role.guard';
import { JwtPayload } from '@auth/interfaces';
import { CurrentUser, Roles } from '@common/decorators';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users.map((user) => new UserResponse(user));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.userService.delete(id, user);
  }

  @Get()
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async updateUser(@Body() body: Partial<User>) {
    const user = await this.userService.save(body);
    return new UserResponse(user);
  }
}
