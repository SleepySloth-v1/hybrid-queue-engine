// Prisma config for Hybrid Queue Engine
// Uses connection pooler (DATABASE_URL) for runtime
// Uses direct connection (DIRECT_URL) for migrations
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'] || process.env['DATABASE_URL'],
  },
});
