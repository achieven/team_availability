import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseDaoService } from './base-dao.service';
import { MutateInSpec } from 'couchbase';

@Injectable()
export class TeamDaoService extends BaseDaoService implements OnModuleInit {

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

    async insertTeams(users: string[]): Promise<any> {

        const half = Math.ceil(users.length / 2);

        const firstHalf = users.slice(0, half);

        const secondHalf = users.slice(half);

        const teams = [
            {
                id: '1',
                name: 'Team 1',
                members: firstHalf,
            },
            {
                id: '2',
                name: 'Team 2',
                members: secondHalf,
            }
        ];

        let promises = [];

        for (const team of teams) {
            promises.push(this.insert(team));
        }

        return Promise.all(promises);
    }

    protected async createIndexes(): Promise<void> {}
}
