import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database.service';
import { Cluster, Bucket, Collection, Scope, DocumentNotFoundError, MutateInSpec, CollectionQueryIndexManager } from 'couchbase';

@Injectable()
export class BaseDaoService implements OnModuleInit {
    protected cluster    : Cluster;
    protected bucket     : Bucket;
    protected scope      : Scope;
    protected bucketName : string;
    protected scopeName  : string;
    protected collection : Collection;
    protected collectionName : string;
    protected indexManager : CollectionQueryIndexManager;
    protected indexCreationOptions = {
        ignoreIfExists: true,
        deferred: true
    }
    
    constructor(
        bucketName: string,
        scopeName: string,
        collectionName: string,
        protected readonly databaseService: DatabaseService) {
            this.bucketName = bucketName;
            this.scopeName = scopeName;
            this.collectionName = collectionName;
    }
    
    async onModuleInit() {
        this.cluster = await this.databaseService.getCluster();
        this.bucket = this.cluster.bucket(this.bucketName);
        this.scope = this.bucket.scope(this.scopeName);
        this.collection = this.scope.collection(this.collectionName);
  
        console.log(`Connected to bucket: ${this.bucketName}, scope: ${this.scopeName}, collection: ${this.collectionName}`);
  
        await this.createIndexManager();
    }

    protected get bucketScopeCollection() {
        return `${this.bucketName}.${this.scopeName}.${this.collectionName}`;
    }
    
    async insert(doc: any): Promise<any> {
        try {
            const id = doc.id || doc._id || this.generateId();
            const document = { ...doc, id, _id: id };
            const result = await this.collection.insert(id, document);
            return { id, ...document, cas: result.cas };
        } catch (error) {
            console.error('Insert error:', error);
            throw error;
        }
    }

    async mutateIn(key: string, specs: any[], options?: any): Promise<any> {
        try {
        const collection = await this.collection;
        return collection.mutateIn(key, specs, options);
        } catch (error) {
            console.error('MutateIn error:', error);
            throw error;
        }
    }

    async query(query: string, params?: any[]): Promise<any[]> {
        try {
            const result = await this.cluster.query(query, { parameters: params });
            return result.rows;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }
    
    protected generateId(): string {
        return uuidv4();
    }

    protected async createIndexManager(): Promise<void> {
        this.indexManager = new CollectionQueryIndexManager(this.collection);
    }
}
