import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { StatusModule } from './status/status.module';
import { DatabaseModule } from './database/database.module';
import { DebugInterceptor } from './debug/debug.interceptor';
import { DebugService } from './debug/debug.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-jwt-secret',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
    DatabaseModule,
    AuthModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [
    DebugService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DebugInterceptor,
    },
  ],
})
export class AppModule {}
