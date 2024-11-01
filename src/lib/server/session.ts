import { sha256 } from "@oslojs/crypto/sha2";
import { db, sessions, users } from "./db";
import { eq } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";

import type { User, Session } from "./db";
import type { RequestEvent } from "@sveltejs/kit";

/**
 * Generates a random session token.
 *
 * This function creates a random 20-byte token using the crypto API,
 * encodes it to a base32 string without padding, and returns the result.
 *
 * @returns {string} The generated session token.
 */
export function generateSessionToken(): string {
    // Generate a random 20-byte token
    const bytes = new Uint8Array(20);
    // Use the crypto API to fill the array with random values
    crypto.getRandomValues(bytes);
    // Encode the bytes to a base32 string
    const token = encodeBase32LowerCaseNoPadding(bytes);
    // Return the generated token
    return token;
}

/**
 * Creates a new session for a user.
 *
 * This function generates a session ID by hashing the provided token,
 * creates a session object with a 1-hour expiration time, inserts the
 * session into the database, and returns the created session.
 *
 * @param token - The token used to generate the session ID.
 * @param userId - The ID of the user for whom the session is being created.
 * @returns A promise that resolves to the created session object.
 */
export async function createSession(token:string, userId: number): Promise<Session> {
    // 1. Hash the token to get the session ID
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    // 2. Create a session object
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
    }
    // 3. Insert the session into the database
    await db.insert(sessions).values(session);
    // 4. Return the created session
    return session;
}

/**
 * Retrieves the session ID from the cookies of the given request event.
 *
 * @param event - The request event containing the cookies.
 * @returns The session ID as a lowercase hexadecimal string.
 */
export const getSessionId = (event: RequestEvent): string | null => {
    const token = event.cookies.get('session');
    if (token) {
        return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    }
    return null;
}

/**
 * Validates a session token 
 *
 * @param token - The session token to validate.
 * @returns A promise that resolves to a `SessionValidationResult` object containing the session and user information.
 */
export async function validateSessionToken(event: RequestEvent): Promise<SessionValidationResult> {
    // 1. Hash the token to get the session ID
    const sessionId = getSessionId(event);
    if (!sessionId) {
        return { session: null, user: null };
    }

    // 2. Query the database for the session
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId))

    // 3. Check if the session exists and is valid
    if (result.length === 0) {
        return { session: null, user: null };
    }

    // 4. Check if the session is expired
    const { user, session } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
        // Session expired
        await invalidateSesssion(event);
        return { session: null, user: null };
    }

    // 5. Extend session if it's about to expire
    if (Date.now() >= session.expiresAt.getTime() - 20 * 60 * 1000) { // 20 minutes in milliseconds
        session.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Extend session by 1 hour
        updateSessionCookieExpiration(event, session.expiresAt);
        await db.update(sessions).set({ expiresAt: session.expiresAt }).where(eq(sessions.id, sessionId));
    }
    
    // 6. Return the session and user
    return { session, user };
}

/**
 * Sets a session token cookie in the client's browser.
 *
 * @param event - The request event containing the cookies object.
 * @param token - The session token to be set in the cookie.
 * @param expiresAt - The expiration date of the cookie.
 */
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set('session' , token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
    });
}

export function updateSessionCookieExpiration(event: RequestEvent, expiresAt: Date): void {
    let token = event.cookies.get('session');
    if (token) {
        event.cookies.set('session', token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: expiresAt,
            path: '/'
        });
    }
}

/**
 * Deletes the session token cookie by setting its value to an empty string and its maxAge to 0.
 * This effectively removes the cookie from the client's browser.
 *
 * @param event - The RequestEvent object containing the cookies to be modified.
 */
export function deleteSesssionTokenCookie(event: RequestEvent): void {
    event.cookies.set('session', '', {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 0, // Set maxAge to 0 to delete the cookie
        path: '/'
    });
}

/**
 * Invalidates a session by deleting it from the database.
 *
 * @param sessionId - The unique identifier of the session to be invalidated.
 * @returns A promise that resolves when the session has been successfully deleted.
 */
export async function invalidateSesssion(event: RequestEvent): Promise<void> {
    const sessionId = getSessionId(event);
    if (sessionId) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };