import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { 
    validateSessionToken,
    setSessionTokenCookie,
    deleteSesssionTokenCookie,
} from '$lib/server/session';
import { sequence } from '@sveltejs/kit/hooks';

// translations via paraglide
const handleParaglide: Handle = i18n.handle();

// sessions
const handleSessions: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') ?? null; // Get the session token from cookies
    // If no token is found, set user and session to null
    if (token === null) {
        event.locals.user = null; // No user is authenticated
        event.locals.session = null; // No session exists
        return resolve(event);
    }
    // Validate the session token
    const { user, session } = await validateSessionToken(token); // Validate the session token
    if (session != null) {
        // If the session is valid, set the session token cookie
        setSessionTokenCookie(event, session.id, new Date(session.expiresAt)); // Set the session token cookie
    } else {
        // If the session is invalid, delete the session token cookie
        deleteSesssionTokenCookie(event); // Delete the session token cookie
    }
    // Set the user and session in locals
    event.locals.user = user; 
    event.locals.session = session;
    // Continue to the next middleware or route handler
    return resolve(event);
}

// export a sequence of handlers
export const handle = sequence(handleParaglide, handleSessions);