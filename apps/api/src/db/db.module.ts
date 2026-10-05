import {
  Global,
  Inject,
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { createAuth, type Auth } from '../lib/auth';
import { createDb, type Db } from '../prisma/db';

export const PG_POOL = Symbol('PG_POOL');
export const DB = Symbol('DB');
export const AUTH = Symbol('AUTH');
export const InjectDb = () => Inject(DB);
export const InjectAuth = () => Inject(AUTH);
export type { Auth, Db };

@Injectable()
class DbLifecycle implements OnApplicationShutdown {
  constructor(
    @InjectDb() private readonly db: Db,
    @Inject(PG_POOL) private readonly pool: Pool,
  ) {}

  async onApplicationShutdown() {
    await this.db.close();
    await this.pool.end();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Pool({ connectionString: config.getOrThrow<string>('DATABASE_URL') }),
    },
    {
      provide: DB,
      inject: [PG_POOL],
      useFactory: (pool: Pool): Db => createDb(pool),
    },
    {
      provide: AUTH,
      inject: [PG_POOL, ConfigService],
      useFactory: (pool: Pool, config: ConfigService): Auth =>
        createAuth(pool, config.get<string>('BETTER_AUTH_URL') ?? 'http://localhost:3000'),
    },
    DbLifecycle,
  ],
  exports: [DB, AUTH],
})
export class DbModule {}
