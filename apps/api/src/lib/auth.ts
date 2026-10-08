import { betterAuth } from 'better-auth';
import type { Pool } from 'pg';

// better-auth's Prisma adapter only supports Prisma 5–7, so it talks to
// Postgres through the same pg Pool that the Prisma 8 client uses.
export const createAuth = (pool: Pool, baseURL: string) =>
  betterAuth({
    database: pool,
    baseURL,
    socialProviders:{
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!
      }
    }
  });

export type Auth = ReturnType<typeof createAuth>;
