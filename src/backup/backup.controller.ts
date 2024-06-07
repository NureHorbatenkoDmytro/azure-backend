import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';

import * as fs from 'fs';
import * as path from 'path';

import { BackupService } from './backup.service';
import { BackupDto } from './dto/backup.dto';

import { RolesGuard } from '@auth/guargs/role.guard';
import { Roles } from '@common/decorators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');

@ApiBearerAuth()
@ApiTags('backup')
@Controller('backup')
@UseGuards(RolesGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @ApiOperation({ summary: 'Create a backup' })
  @Post()
  @Roles(Role.ADMIN)
  async createBackup() {
    return this.backupService.createBackup();
  }

  @ApiOperation({ summary: 'Restore a backup' })
  @ApiBody({ type: BackupDto })
  @Post('restore')
  @Roles(Role.ADMIN)
  async restoreBackup(@Body() backupDto: BackupDto) {
    return this.backupService.restoreBackup(backupDto.fileName);
  }

  @ApiOperation({ summary: 'Download a backup' })
  @ApiParam({ name: 'folderName', required: true, description: 'The name of the backup folder' })
  @Get('download/:folderName')
  @Roles(Role.ADMIN)
  async downloadBackup(@Param('folderName') folderName: string, @Res() res: Response) {
    const folderPath = path.resolve('backups', folderName);

    if (!fs.existsSync(folderPath)) {
      throw new NotFoundException(`Backup folder ${folderName} not found`);
    }

    const zip = new JSZip();
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath);
      zip.file(file, fileContent);
    }

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    const zipFilePath = path.resolve('backups', `${folderName}.zip`);
    fs.writeFileSync(zipFilePath, zipContent);

    res.download(zipFilePath, `${folderName}.zip`, (err) => {
      if (err) {
        throw new NotFoundException(`Error downloading backup: ${err.message}`);
      }
      // Clean up the zip file after download
      fs.unlinkSync(zipFilePath);
    });
  }
}
