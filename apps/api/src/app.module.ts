import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import type { Pool } from 'pg';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DbModule, PG_POOL } from './db/db.module.js';
import { createAuth } from './lib/auth.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule.forRootAsync({
      inject: [PG_POOL, ConfigService],
      useFactory: (pool: Pool, config: ConfigService) => ({
        auth: createAuth(pool, config.getOrThrow<string>('BETTER_AUTH_URL')),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
