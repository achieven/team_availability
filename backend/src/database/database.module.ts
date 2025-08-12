import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDaoService } from './dao/user-dao.service';
import { TeamDaoService } from './dao/team-dao.service';
import { TransactionsDaoService } from './dao/transactions-dao';

@Global()
@Module({
    providers: [DatabaseService, UserDaoService, TeamDaoService, TransactionsDaoService],
    exports: [DatabaseService, UserDaoService, TeamDaoService, TransactionsDaoService],
})
export class DatabaseModule {}
