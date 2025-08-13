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

  async getAllStatuses(): Promise<Status[]> {
    try {
      const query = `
        SELECT s.* FROM \`team_availability\`.\`_default\`.\`_default\` s
        WHERE s.type = "status"
        AND s.lastUpdated = (
          SELECT MAX(s2.lastUpdated) 
          FROM \`team_availability\`.\`_default\`.\`_default\` s2 
          WHERE s2.type = "status" AND s2.userId = s.userId
        )
      `;
      const result = await this.userDaoService.query(query);
      return result;
    } catch (error) {
      console.error('Error getting all statuses:', error);
      return [];
    }
  }

  async getUserStatuses(userId: string): Promise<Status[]> {
    try {
      const query = `
        SELECT * FROM \`team_availability\`.\`_default\`.\`_default\` 
        WHERE type = "status" AND userId = $userId 
        ORDER BY lastUpdated DESC
      `;
      const result = await this.userDaoService.query(query, [userId]);
      return result;
    } catch (error) {
      console.error('Error getting user statuses:', error);
      return [];
    }
  }
}
