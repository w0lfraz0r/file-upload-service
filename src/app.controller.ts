import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
  Headers,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppService } from './app.service';
import { join } from 'path';
import * as fs from 'fs';

const API_KEY = 'your-fixed-api-key'; // Replace with your actual fixed API key

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any, @Headers('api-key') apiKey: string) {
    if (apiKey !== API_KEY) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  @Get('files/:filename')
  getFile(
    @Res() res: Response,
    @Headers('api-key') apiKey: string,
    @Param('filename') filename: string,
  ) {
    if (apiKey !== API_KEY) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const filePath = join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
