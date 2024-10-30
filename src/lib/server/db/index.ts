import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
const client = new Database( env.DB_URL || 'db.sqlite' );
export const db = drizzle(client);

import { users, sessions } from './schema'; // Importing the users and sessions tables and their types
import type { User, Session } from './schema'; // Importing the User and Session types
export { users, sessions }; // Exporting the users and sessions tables and their types
export type { User, Session }; // Exporting the User and Session types