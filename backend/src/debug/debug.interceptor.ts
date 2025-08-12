import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DebugInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DebugInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;
    const now = Date.now();

    // Log the incoming request
    this.logger.log(`🚀 ${method} ${url}`, 'API Request');
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`📦 Request Body: ${JSON.stringify(body)}`, 'API Request');
    }
    
    if (Object.keys(params || {}).length > 0) {
      this.logger.debug(`🔗 Request Params: ${JSON.stringify(params)}`, 'API Request');
    }
    
    if (Object.keys(query || {}).length > 0) {
      this.logger.debug(`❓ Request Query: ${JSON.stringify(query)}`, 'API Request');
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(`✅ ${method} ${url} - ${responseTime}ms`, 'API Response');
          this.logger.debug(`📤 Response: ${JSON.stringify(data)}`, 'API Response');
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(`❌ ${method} ${url} - ${responseTime}ms - ${error.message}`, error.stack, 'API Error');
        },
      }),
    );
  }
}
