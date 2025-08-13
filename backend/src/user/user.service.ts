import { Injectable } from '@nestjs/common';
import { UserDaoService } from 'src/database/dao/user-dao.service';
import { AuthService } from 'src/auth/auth.service';

export interface Status {
  status: 'available' | 'busy' | 'away' | 'offline';
}

@Injectable()
export class UserService {
  constructor(private readonly userDaoService: UserDaoService,
    private readonly authService: AuthService
  ) {}

  async getCurrentStatus(userId: string): Promise<Status | null> {
    return await this.userDaoService.getStatus(userId);
  }

  async updateStatus(userId: string, status: Status): Promise<Boolean> {
    return await this.userDaoService.updateStatus(userId, status.status);
  }

  async getTeamMembers(teamId: string, userId: string): Promise<Boolean> {
    const teamMembers = await this.userDaoService.getTeamMembers(teamId, userId);
    return teamMembers.map((member) => {
      return this.authService.omitPassword(member);
    });
  }
}
