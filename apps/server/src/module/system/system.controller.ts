import { Controller, Get, Post } from '@nestjs/common';
import { SystemService } from './system.service.js';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('sign')
  sign() {
    return this.systemService.getHello();
  }

  @Post('login')
  login() {
    return 'login';
  }

  @Post('logout')
  logout() {
    return 'logout';
  }
}
