import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DebugService {
  private readonly logger = new Logger(DebugService.name);

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }

  // Helper method to log API requests
  logRequest(method: string, url: string, body?: any, params?: any) {
    this.logger.log(`API Request: ${method} ${url}`, 'API');
    if (body) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`, 'API');
    }
    if (params) {
      this.logger.debug(`Request Params: ${JSON.stringify(params)}`, 'API');
    }
  }

  // Helper method to log API responses
  logResponse(method: string, url: string, statusCode: number, response?: any) {
    this.logger.log(`API Response: ${method} ${url} - ${statusCode}`, 'API');
    if (response) {
      this.logger.debug(`Response: ${JSON.stringify(response)}`, 'API');
    }
  }

  // Helper method to log database operations
  logDbOperation(operation: string, collection: string, data?: any) {
    this.logger.log(`DB Operation: ${operation} on ${collection}`, 'DATABASE');
    if (data) {
      this.logger.debug(`DB Data: ${JSON.stringify(data)}`, 'DATABASE');
    }
  }
}
