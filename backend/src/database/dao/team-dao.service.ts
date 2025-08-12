import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseDaoService } from './base-dao.service';
import { MutateInSpec, TransactionAttemptContext } from 'couchbase';

@Injectable()
export class TeamDaoService extends BaseDaoService implements OnModuleInit {

    private dummyTeams = ['Team 1','Team 2'];

    constructor(
        protected readonly databaseService: DatabaseService
    ) {
        super('default', '_default', 'teams', databaseService);
    }

    async onModuleInit() {
        super.onModuleInit();
    }

    async getAllTeams(email: string): Promise<any | null> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE email = $email AND type = "user" 
            LIMIT 1
        `;
        const result = await this.cluster.query(query, {parameters: {email}});
        return result.rows[0] ? result.rows[0][this.collectionName] : null;
    }

    async insertTeams(transactionCtx: TransactionAttemptContext, users: string[]): Promise<any> {
        const half = Math.ceil(users.length / 2);
        const firstHalf = users.slice(0, half);
        const secondHalf = users.slice(half);

        const teams = this.dummyTeams.map((team, index) => {
            return {
                name: team,
                members: index === 0 ? firstHalf : secondHalf
            }
        });

        let insertPromises = [];

        for (const team of teams) {
            const id = this.generateId();
            insertPromises.push(transactionCtx.insert(this.collection, id, {
                id,
                ...team
            }));
        }

        await Promise.all(insertPromises);
    }

    async getDummyTeams(transactionCtx: TransactionAttemptContext | null, userIds: any[]): Promise<any> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE ANY member IN members SATISFIES member IN [${userIds.map(id => `"${id}"`).join(',')}] END
        `;
        if (transactionCtx) {
            const result = await transactionCtx.query(query);
            return result.rows.map(row => row[this.collectionName]);
        }
        const result = await this.query(query);
        return result.map(row => row[this.collectionName]);
    }

    protected async createIndexes(): Promise<void> {}
}
