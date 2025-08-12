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
        const connectionString = process.env.COUCHBASE_URL || 'couchbase://localhost';
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

  private async createIndexes() {
    try {
      
      // Create indexes for users
      await this.cluster.query(`
        CREATE INDEX idx_users_email ON \`default\`.\`_default\`.\`team_availability\` (email) 
        WHERE type = "user"
      `).catch(err => {
        if (!err.message.includes('already exists')) {
          console.error('Error creating users email index:', err);
        }
      });

      // Create indexes for status
      await this.cluster.query(`
        CREATE INDEX idx_status_userId ON \`default\`.\`_default\`.\`team_availability\` (userId) 
        WHERE type = "status"
      `).catch(err => {
        if (!err.message.includes('already exists')) {
          console.error('Error creating status userId index:', err);
        }
      });

      await this.cluster.query(`
        CREATE INDEX idx_status_userId_lastUpdated ON \`default\`.\`_default\`.\`team_availability\` (userId, lastUpdated) 
        WHERE type = "status"
      `).catch(err => {
        if (!err.message.includes('already exists')) {
          console.error('Error creating status userId_lastUpdated index:', err);
        }
      });

      console.log('Indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }
}
