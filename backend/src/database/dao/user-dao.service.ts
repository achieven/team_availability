import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseDaoService } from './base-dao.service';
import { MutateInSpec, TransactionAttemptContext } from 'couchbase';

@Injectable()
export class UserDaoService extends BaseDaoService implements OnModuleInit {
    private dummyUsers = [
        {
            email: 'a@gmail.com',
            name: 'a'
        },
        {
            email: 'b@gmail.com',
            name: 'b'
        },
        {
            email: 'c@gmail.com',
            name: 'c'
        },
        {
            email: 'd@gmail.com',
            name: 'd'
        },
        {
            email: 'e@gmail.com',
            name: 'e'
        },
        {
            email: 'f@gmail.com',
            name: 'f'
        },
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

    async getTeamMembers(teamId: string, userId: string): Promise<any> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE teamId = $teamId AND id != $userId
        `;
        const result = await this.cluster.query(query, {parameters: {teamId, userId}});
        return result.rows.map(row => row[this.collectionName]);
    }
    

    async insertUsers(transactionCtx: TransactionAttemptContext, hashedPassword: string, teamIds: string[]): Promise<any> {
        let insertPromises = [];
        this.dummyUsers.forEach((user, index) => {
            const id = this.generateId();
            insertPromises.push(transactionCtx.insert(this.collection, id ,{
                id,
                email: user.email,
                name: user.name,
                password: hashedPassword,
                teamId: index % 2 === 0 ? teamIds[0] : teamIds[1]
            }));
        });
        return await Promise.all(insertPromises);
        
    }

    async getDummyUsers(transactionCtx: TransactionAttemptContext | null): Promise<any> {
        const query = `
            SELECT * FROM ${this.bucketScopeCollection} 
            WHERE email IN [${this.dummyUsers.map(user => `"${user.email}"`).join(',')}]
        `;
        if (transactionCtx) {
            const result = await transactionCtx.query(query);
            return result.rows.map(row => row[this.collectionName]);
        }
        const result = await this.query(query);
        return result.map(row => row[this.collectionName]);
    }

    async ensureIndexes() {
        await this.indexManager.createIndex('user_email', 
            ['email'],
            this.indexCreationOptions
        );
        await this.indexManager.createIndex('team_members', 
            ['teamId',  'id'],
            this.indexCreationOptions
        );
    }
}
