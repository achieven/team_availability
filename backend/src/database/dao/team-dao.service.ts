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

    async insertTeams(transactionCtx: TransactionAttemptContext): Promise<any> {
        let insertPromises = [];

        for (const team of this.dummyTeams) {
            const id = this.generateId();
            insertPromises.push(transactionCtx.insert(this.collection, id, {
                id,
                name: team
            }));
        }

        const result = await Promise.all(insertPromises);
        return result.map((row) => {
            return {
                id: row.id.key,
            }
        });
    }

    async getDummyTeams(transactionCtx: TransactionAttemptContext | null): Promise<any> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
        `;
        if (transactionCtx) {
            const result = await transactionCtx.query(query);
            return result.rows.map(row => row[this.collectionName]);
        }
        const result = await this.query(query);
        return result.map(row => row[this.collectionName]);
    }

    async ensureIndexes(): Promise<void> {}
}
