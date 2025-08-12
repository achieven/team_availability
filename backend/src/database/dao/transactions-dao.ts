import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import * as couchbase from 'couchbase';
import { UserDaoService } from './user-dao.service';
import { TeamDaoService } from './team-dao.service';

@Injectable()
export class TransactionsDaoService implements OnModuleInit {
    private cluster: couchbase.Cluster;

    constructor(
        protected readonly databaseService: DatabaseService,
        protected readonly userDaoService: UserDaoService,
        protected readonly teamDaoService: TeamDaoService,
    ) {
    }

    async onModuleInit() {
        this.cluster = await this.databaseService.getCluster();
    }

    async initializeDB(hashedPassword: string) {
        let userIds: any[] = [];
        await this.cluster.transactions().run(async (transactionCtx) => {
            let users = await this.userDaoService.getDummyUsers(transactionCtx);
            if (users.length === 0) {
                users = await this.userDaoService.insertUsers(transactionCtx, hashedPassword);
            }
            userIds = users.map(user => user.id);
            let teams = await this.teamDaoService.getDummyTeams(transactionCtx, userIds);
            if (teams.length === 0) {
                teams =await this.teamDaoService.insertTeams(transactionCtx, userIds);
            }
        });

        const users = await this.userDaoService.getDummyUsers(null);
        const teams = await this.teamDaoService.getDummyTeams(null, userIds);
        return { users, teams };
    }

    protected async createIndexes(): Promise<void> {}
}
