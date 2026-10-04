import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const createDb = (url: string) =>
  postgres<Contract>({ 
    contractJson,
    url,
  });

export type Db = ReturnType<typeof createDb>;
