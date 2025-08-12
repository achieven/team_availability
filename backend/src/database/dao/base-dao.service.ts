import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database.service';
import { Cluster, Bucket, Collection, Scope, DocumentNotFoundError, MutateInSpec } from 'couchbase';

@Injectable()
export class BaseDaoService implements OnModuleInit {
    protected cluster    : Cluster;
    protected bucket     : Bucket;
    protected scope      : Scope;
    protected bucketName : string;
    protected scopeName  : string;
    protected collection : Collection;
    protected collectionName : string;

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
  
        await this.createIndexes();
    }

    protected get bucketScopeCollection() {
        return `${this.bucketName}.${this.scopeName}.${this.collectionName}`;
    }

    async findOne(id: string): Promise<any> {
        try {
          const result = await this.collection.get(id);
          return result.content;
        } catch (error: any) {
          if (error.code === DocumentNotFoundError) {
            return null;
          }
          throw error;
        }
      }
    
      async insert(doc: any): Promise<any> {
        const id = doc.id || doc._id || this.generateId();
        const document = { ...doc, id, _id: id };
        const result = await this.collection.insert(id, document);
        return { id, ...document, cas: result.cas };
      }

      async mutateIn(key: string, specs: any[], options?: any): Promise<any> {
        const collection = await this.collection;
        console.log(this.collectionName,'mutateIn', key);
        return collection.mutateIn(key, specs, options);
      }
    
      async update(id: string, doc: any): Promise<any> {
        try {
          const existing = await this.collection.get(id);
          const updatedDoc = { ...existing.content, ...doc, id, _id: id };
          const result = await this.collection.replace(id, updatedDoc, { cas: existing.cas });
          return { id, ...updatedDoc, cas: result.cas };
        } catch (error: any) {
          if (error.code === DocumentNotFoundError) {
            // Document doesn't exist, create it
            return await this.insert(doc);
          }
          throw error;
        }
      }
    
      async delete(id: string): Promise<any> {
        try {
          const result = await this.collection.remove(id);
          return { id, cas: result.cas };
        } catch (error: any) {
          if (error.code === DocumentNotFoundError) {
            return null;
          }
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
    
      private generateId(): string {
        return uuidv4();
      }

    protected async createIndexes(): Promise<void> {}
}
