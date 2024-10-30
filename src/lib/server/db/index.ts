import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
const client = new Database( env.DB_URL || 'db.sqlite' );
export const db = drizzle(client);
