import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { TransactionsDaoService } from './database/dao/transactions-dao';

@Injectable()
export class AppService {
    constructor(
        private readonly transactionsDao: TransactionsDaoService,
        private readonly authService: AuthService,
    ) {}

  async initializeDb(): Promise<{ users: any[], teams: any[] }> {
    try {
        const hashedPassword = await this.authService.hashPassword('12345678');
        const { users, teams } = await this.transactionsDao.initializeDB(hashedPassword);
        return { 
            users:users.map((u) => {
                const {password, ...result } = u;
                return result
            }), 
            teams };
    } catch (error) {
        throw error;
    }
  }
}
