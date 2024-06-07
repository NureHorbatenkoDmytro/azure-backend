import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, IsDateString } from 'class-validator';

import { IsPlantExists } from '@/validators';

export class CreatePlantDataDto {
  @ApiProperty({ example: 40, description: 'The humidity level of the plant' })
  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @ApiProperty({ example: 22, description: 'The temperature level of the plant' })
  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @ApiProperty({ example: 300, description: 'The light level of the plant' })
  @IsNumber()
  @IsNotEmpty()
  light: number;

  @ApiProperty({ example: 50, description: 'The nutrient level of the plant' })
  @IsNumber()
  @IsNotEmpty()
  nutrientLevel: number;

  @ApiProperty({ example: 'uuid-of-plant', description: 'The ID of the plant' })
  @IsUUID()
  @IsNotEmpty()
  @IsPlantExists()
  plantId: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'The timestamp of the data entry',
  })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}
