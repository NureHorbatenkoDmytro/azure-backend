import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePlantTypeDto {
  @ApiProperty({ example: 'Indoor Plant', description: 'The type name of the plant' })
  @IsString()
  @IsNotEmpty()
  typeName: string;

  @ApiProperty({
    example: 'Plants suitable for indoor environments',
    description: 'Description of the plant type',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 40, description: 'Optimal humidity for the plant type' })
  @IsNumber()
  @IsNotEmpty()
  optimalHumidity: number;

  @ApiProperty({ example: 22, description: 'Optimal temperature for the plant type' })
  @IsNumber()
  @IsNotEmpty()
  optimalTemperature: number;

  @ApiProperty({ example: 300, description: 'Optimal light level for the plant type' })
  @IsNumber()
  @IsNotEmpty()
  optimalLight: number;
}
