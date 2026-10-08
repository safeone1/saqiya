import {
  Global,
  Inject,
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { createDb, type Db } from '../prisma/db.js';

export const PG_POOL = Symbol('PG_POOL');
export const DB = Symbol('DB');
export const InjectDb = () => Inject(DB);
export type { Db };

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
    DbLifecycle,
  ],
  exports: [PG_POOL, DB],
})
export class DbModule {}
