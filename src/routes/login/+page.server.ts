import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { verifyPasswordHash } from "$lib/server/password";
import { loginFormSchema } from "./schema";
import { db, users } from "$lib/server/db";
import { eq } from 'drizzle-orm';
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";

export const load: PageServerLoad = async (event) => {
    const user = event.locals.user;
    if (user) {
        return redirect(302, '/');
    }
}

export const actions: Actions = {
    // Handle login form submission
    default: async (event) => {
        // validate the form
        const form = await superValidate(event, zod(loginFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // then we can check if the user exists
        const user = await db.select().from(users).where(eq(users.email, form.data.email)).limit(1);
        if (user.length != 1) {
            return setError(form, '', 'Invalid username or password');
        }
        // check if the user is disabled
        if (user[0].disabled) {
            return setError(form, '', 'User is disabled');
        }
        // if the user has not set a password, then they cannot login
        if (!user[0].password) {
            return setError(form, '', 'User not yet activated');
        }
        // check if the password is correct
        if (!await verifyPasswordHash(user[0].password, form.data.password)) {
            return setError(form, '', 'Invalid username or password');
        }
        // update the last login
        const now = new Date(Date.now());
        await db.update(users).set({last_login: now}).where(eq(users.id, user[0].id));
        // then log the user in
        const token = generateSessionToken();
        const sess = await createSession(token, user[0].id);
        setSessionTokenCookie(event, token, sess.expiresAt);
        return redirect(302, '/');
    }
}