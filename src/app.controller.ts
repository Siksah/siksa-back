import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express'
import { join } from 'path'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('favicon.ico')
  getFavicon(@Res() res: Response) {
    return res.sendFile(join(__dirname, 'public', 'favicon.ico'))
  }

  @Get('api-test')
  getApiTest(@Res() res: Response) {
    return res.sendFile(join(__dirname, 'public', 'index.html'))
  }
}