import { Controller, Get, Put, Body, UseGuards, Request, Res } from '@nestjs/common';
import { StatusService, Status } from './status.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Controller('status')
@UseGuards(SessionAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('current')
  async getCurrentStatus(@Request() req, @Res() res) {
    try {
    let status = await this.statusService.getCurrentStatus(req.session.userId);
    if (!status) {
        status =  {status: 'offline'};
    }
      res.status(200).json(status);
    } catch (error) {
      console.error('Error getting current status:', error);
      res.status(500).json({status: 'offline'});
    }
  }

  @Put('update')
  async updateStatus(@Request() req, @Body() status: Status, @Res() res) {
    try {
      await this.statusService.updateStatus(req.session.userId, status);
      res.status(200).json(status);
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({result: false});
    }
  }

  @Get('all')
  async getAllStatuses() {
    return await this.statusService.getAllStatuses();
  }

  @Get('user')
  async getUserStatuses(@Request() req) {
    return await this.statusService.getUserStatuses(req.session.userId);
  }
}
