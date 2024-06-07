import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BackupDto {
  @ApiProperty({
    example: `backup-${new Date().toISOString()}.csv`,
    description: 'The name of the backup file',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;
}
