import {
  Global,
  Inject,
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb, type Db } from '../prisma/db.js';

export const DB = Symbol('DB');
export const InjectDb = () => Inject(DB);
export type { Db };

@Injectable()
class DbLifecycle implements OnApplicationShutdown {
  constructor(@InjectDb() private readonly db: Db) {}

  async onApplicationShutdown() {
    await this.db.close();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Db =>
        createDb(config.getOrThrow<string>('DATABASE_URL')),
    },
    DbLifecycle,
  ],
  exports: [DB],
})
export class DbModule {}
