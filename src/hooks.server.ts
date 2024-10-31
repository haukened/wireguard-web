import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { 
    validateSessionToken,
    setSessionTokenCookie,
    deleteSesssionTokenCookie,
} from '$lib/server/session';
import { sequence } from '@sveltejs/kit/hooks';
import fs from 'fs';
import { redirect } from '@sveltejs/kit';

/**
 * Handle setup middleware.
 * 
 * This middleware checks if the setup process has been completed by looking for the existence of a 
 * `.setup_completed` file. If the file does not exist and the current URL path is not `/setup`, 
 * it redirects the user to the `/setup` page. Otherwise, it proceeds with the request resolution.
 * 
 * @param {Object} param - The parameter object.
 * @param {Object} param.event - The event object containing request details.
 * @param {Function} param.resolve - The function to resolve the request.
 * 
 * @returns {Promise<Response>} The response object, either a redirect to the setup page or the resolved request.
 */
const handleSetup: Handle = async ({ event, resolve }) => {
    if (!fs.existsSync('.setup_completed')) {
        // If setup is not completed, redirect to setup page
        if (event.url.pathname !== '/setup') {
            return redirect(302, '/setup');
        }
    }
    return resolve(event);
}

// Handle translations via paraglide
const handleParaglide: Handle = i18n.handle();


/**
 * Middleware to handle user sessions.
 * 
 * This function retrieves the session token from cookies, validates it, and sets the user and session
 * information in the `event.locals` object. If no token is found or the session is invalid, it ensures
 * that the user and session are set to null and manages the session token cookie accordingly.
 * 
 * @param {Object} param0 - The event and resolve function.
 * @param {Object} param0.event - The event object containing request and response information.
 * @param {Function} param0.resolve - The function to continue to the next middleware or route handler.
 * 
 * @returns {Promise<Response>} The response from the next middleware or route handler.
 */
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
export const handle = sequence(handleSetup, handleParaglide, handleSessions);