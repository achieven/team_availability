import { Controller, Get, Post, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Post('initialize')
  async isInitialized(): Promise<any> {
    const {users, teams} = await this.appService.initializeDb();
    return { users, teams };
  }

  @Get()
  getHello(): string {
    return 'hello world';
  }
}
