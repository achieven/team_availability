import { Controller, Get, Post } from '@nestjs/common';
import { TeamDaoService } from './database/dao/team-dao.service';
import { UserDaoService } from './database/dao/user-dao.service';

@Controller()
export class AppController {
  constructor(
    private readonly teamDaoService: TeamDaoService,
    private readonly userDaoService: UserDaoService,
  ) {}

  @Post('initialize')
  async initialize(): Promise<any> {
    const users = await this.userDaoService.insertUsers();
    const userIds = users.map(user => user.id);
    const teams = await this.teamDaoService.insertTeams(userIds);
    return { users, teams };
  }

  @Get()
  getHello(): string {
    return 'hello world';
  }
}
