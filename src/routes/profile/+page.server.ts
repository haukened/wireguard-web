import { sanitizeUser, db, type User, users, createGravatarURL, emailExists } from "$lib/server/db";
import { superValidate, setError, message } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { profileFormSchema } from "./schema";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';
import * as m from '$lib/paraglide/messages.js';

export const load: PageServerLoad = async (event) => {
    let currentUser = event.locals.user;
    if (!currentUser) {
        // if there isn't a current user, send to logout
        return redirect(401, "/logout");
    }
    const user = sanitizeUser(currentUser);
    return { 
        form: await superValidate(user, zod(profileFormSchema)),
    }
}

export const actions: Actions = {
    // Handle login form submission
    default: async (event) => {
        if (!event.locals.user) {
            return redirect(401, "/logout");
        }
        // validate the form
        const form = await superValidate(event, zod(profileFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // then we can check if the user exists
        const user = await db.select().from(users).where(eq(users.id, event.locals.user.id)).limit(1);
        if (user.length != 1) {
            return setError(form, '', m.errorUserNotFound() + ' ' + event.locals.user.email);
        }
        const exists = await emailExists(form.data.email);
        if (exists && form.data.email !== event.locals.user.email) {
            return setError(form, 'email', m.errorEmailExists());
        }
        // update the user
        try {
            await db.update(users).set({
                firstname: form.data.firstname,
                lastname: form.data.lastname,
                email: form.data.email,
                updated_at: new Date(Date.now())
            }).where(eq(users.id, event.locals.user.id));
        } catch (e) {
            return setError(form, '', m.errorDatabaseError());
        } finally {
            // update the user object
            event.locals.user = {
                ...event.locals.user,
                firstname: form.data.firstname,
                lastname: form.data.lastname,
                email: form.data.email,
            };
        }
        // return the form
        return message(form, m.profileUpdated());
    }
}