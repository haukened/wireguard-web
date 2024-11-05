import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createHash } from 'crypto';
import Database from 'better-sqlite3';
const client = new Database( 'db.sqlite' );
export const db = drizzle(client);

/**
 * Generates a Gravatar URL for the given email.
 *
 * @param email - The email address to generate the Gravatar URL for. If null, the function returns undefined.
 * @returns The Gravatar URL for the given email, or undefined if the email is null.
 */
export const createGravatarURL = (email: string | null): string | undefined => {
    if (!email) return undefined;
    const hash = createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=404`;
};

/**
 * Checks if an email exists in the users table.
 *
 * @param email - The email address to check for existence.
 * @returns A promise that resolves to a boolean indicating whether the email exists.
 */
export const emailExists = async (email: string): Promise<boolean> => {
    const result = await db.select({count: count()}).from(users).where(eq(users.email, email));
    return result[0].count > 0;
}

/**
 * Sanitizes a user object by extracting and formatting specific user information.
 *
 * @param user - The user object to sanitize.
 * @returns An object containing sanitized user information.
 */
export function sanitizeUser(user: User): User {
    user.password = null;
    return user;
}

import { users, sessions } from './schema'; // Importing the users and sessions tables and their types
import type { User, Session } from './schema'; // Importing the User and Session types
import { count, eq } from 'drizzle-orm';
export { users, sessions }; // Exporting the users and sessions tables and their types
export type { User, Session }; // Exporting the User and Session types