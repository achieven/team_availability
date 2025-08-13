import { Injectable, OnModuleInit } from '@nestjs/common';
import * as couchbase from 'couchbase';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private cluster: couchbase.Cluster;

  async onModuleInit() {
    this.initCluster();
  }

  private async initCluster() {
    try {
        console.log('Connecting to Couchbase cluster');
        const host = process.env.COUCHBASE_HOST || 'localhost';
        const connectionString = `couchbase://${host}`
        const username = process.env.COUCHBASE_USERNAME || 'Administrator';
        const password = process.env.COUCHBASE_PASSWORD || 'password';
        this.cluster = await couchbase.connect(connectionString, {
            username,
            password,
        });
        console.log('Connected to Couchbase cluster');
    } catch (error) {
        console.error('Error connecting to Couchbase:', error);
        throw error;
    }
  }

  async getCluster(): Promise<couchbase.Cluster> {
    if (!this.cluster) {
        await this.initCluster();
    }
    return this.cluster;
  }
}
