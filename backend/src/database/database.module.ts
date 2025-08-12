import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDaoService } from './dao/user-dao.service';
import { TeamDaoService } from './dao/team-dao.service';

@Global()
@Module({
    providers: [DatabaseService, UserDaoService, TeamDaoService],
    exports: [DatabaseService, UserDaoService, TeamDaoService],
})
export class DatabaseModule {}
