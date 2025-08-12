import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseDaoService } from './base-dao.service';
import { MutateInSpec, TransactionAttemptContext } from 'couchbase';

@Injectable()
export class UserDaoService extends BaseDaoService implements OnModuleInit {
    private dummyUsers = [
        'a@gmail.com', 'b@gmail.com', 'c@gmail.com'
    ];

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
            WHERE email = $email 
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
        return result.rows[0];
    }

    async insertUsers(transactionCtx: TransactionAttemptContext, hashedPassword: string): Promise<any> {
        let insertPromises = [];  
        for (const user of this.dummyUsers) {
            const id = this.generateId();
            insertPromises.push(transactionCtx.insert(this.collection, id ,{
                id,
                email: user,
                password: hashedPassword,
            }));
        }
        return await Promise.all(insertPromises);
        
    }

    async getDummyUsers(transactionCtx: TransactionAttemptContext | null): Promise<any> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE email IN [${this.dummyUsers.map(user => `"${user}"`).join(',')}]
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
