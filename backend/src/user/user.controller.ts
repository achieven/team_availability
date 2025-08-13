import { Controller, Get, Put, Body, UseGuards, Request, Res } from '@nestjs/common';
import { UserService, Status } from './user.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Controller('user')
@UseGuards(SessionAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-status')
  async getCurrentStatus(@Request() req, @Res() res) {
    try {
    let status = await this.userService.getCurrentStatus(req.session.userId);
    if (!status) {
        status =  {status: 'offline'};
    }
      res.status(200).json(status);
    } catch (error) {
      console.error('Error getting current status:', error);
      res.status(500).json({status: 'offline'});
    }
  }

  @Put('update-status')
  async updateStatus(@Request() req, @Body() status: Status, @Res() res) {
    try {
      await this.userService.updateStatus(req.session.userId, status);
      res.status(200).json(status);
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({result: false});
    }
  }

  @Get('team-members')
  async getTeamMembers(@Request() req) {
    return await this.userService.getTeamMembers(req.session.teamId, req.session.userId);
  }

  @Get('all')
  async getAllStatuses() {
    return await this.userService.getAllStatuses();
  }

  @Get('user')
  async getUserStatuses(@Request() req) {
    return await this.userService.getUserStatuses(req.session.userId);
  }
}
