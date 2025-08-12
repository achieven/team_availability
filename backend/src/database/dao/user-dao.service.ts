import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseDaoService } from './base-dao.service';
import { MutateInSpec } from 'couchbase';

@Injectable()
export class UserDaoService extends BaseDaoService implements OnModuleInit {

    constructor(
        protected readonly databaseService: DatabaseService
    ) {
        super('default', '_default', 'users', databaseService);
    }

    async onModuleInit() {
        super.onModuleInit();
    }

    async findUserByEmail(email: string): Promise<any | null> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE email = $email AND type = "user" 
            LIMIT 1
        `;
        const result = await this.cluster.query(query, {parameters: {email}});
        return result.rows[0] ? result.rows[0][this.collectionName] : null;
    }

    async updateStatus(userId: string, status: string): Promise<any> {
        const specs = [
            MutateInSpec.upsert('status', status)
        ]

        return await this.mutateIn(userId, specs);
    }

    async getStatus(userId: string): Promise<any> {
        const query = `
            SELECT status FROM ${this.bucketScopeCollection} 
            WHERE id = $userId
            LIMIT 1
        `;
        const result = await this.cluster.query(query, {parameters: {userId}});
        return result.rows[0]?.status;
    }

    async insertUsers(): Promise<any> {
        const users = [
            'a@gmail.com', 'b@gmail.com', 'c@gmail.com'
        ];
        let promises = [];
        for (const user of users) {
            promises.push(this.insert({
                email: user,
                password: 'password',
            }));
        }
        return Promise.all(promises);
    }

    protected async createIndexes(): Promise<void> {}
}
