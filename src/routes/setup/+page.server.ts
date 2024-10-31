import { fail, redirect } from '@sveltejs/kit';
import { db, users } from '$lib/server/db';
import { hashPassword } from '$lib/server/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setupFormSchema } from './schema';
import fs from 'fs';

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(setupFormSchema)),
    }
}

function setupDone() {
    // Create a `.setup-complete` file to indicate that setup is complete
    fs.closeSync(fs.openSync('.setup-complete', 'w'));
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(setupFormSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }
        // if the form is valid, we need to hash the password first
        const hash = await hashPassword(form.data.password);
        // then we can insert the user into the database
        let newId: number;
        try {
            const result = await db.insert(users).values({
                firstname: form.data.firstname,
                lastname: form.data.lastname,
                email: form.data.email,
                username: form.data.username,
                password: hash,
            }).returning()
            newId = result[0].id;
        } catch (e) {
            console.log(e);
            return fail(500, {
                form,
                error: 'An error occurred while setting up the user',
            });
        }
        // then log the user in
        const token = generateSessionToken();
        const sess = await createSession(token, newId);
        setSessionTokenCookie(event, token, sess.expiresAt);
        setupDone();
        return redirect(302, '/');
    }
}