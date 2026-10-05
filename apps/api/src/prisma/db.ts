import postgres from '@prisma/orm-postgres/runtime';
import type { Pool } from 'pg';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

// The pool is shared with better-auth, so it's passed in rather than created
// from a URL. Prisma 8 doesn't end a pool it didn't create — the caller does.
export const createDb = (pool: Pool) =>
  postgres<Contract>({
    contractJson,
    // Prisma 8 pins an older @types/pg; it detects pools by shape at runtime,
    // so only the type declarations disagree.
    pg: pool as unknown as PrismaPgOption,
  });

type PrismaPgOption = NonNullable<Parameters<typeof postgres<Contract>>[0]['pg']>;

export type Db = ReturnType<typeof createDb>;
