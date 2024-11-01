import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createHash } from 'crypto';
import Database from 'better-sqlite3';
import type { UserInfo } from '../../types';
const client = new Database( 'db.sqlite' );
export const db = drizzle(client);

const createGravatarURL = (email: string | null): string | undefined => {
    if (!email) return undefined;
    const hash = createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=404`;
};

export function sanitizeUser(user: User): UserInfo {
    return {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email || undefined,
        gravatar: createGravatarURL(user.email),
        last_login: user.last_login ? new Date(user.last_login) : undefined
    };
}

import { users, sessions } from './schema'; // Importing the users and sessions tables and their types
import type { User, Session } from './schema'; // Importing the User and Session types
export { users, sessions }; // Exporting the users and sessions tables and their types
export type { User, Session }; // Exporting the User and Session types