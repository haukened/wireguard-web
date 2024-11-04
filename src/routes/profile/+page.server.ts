import { sanitizeUser, db, type User, users, createGravatarURL } from "$lib/server/db";
import { superValidate, setError } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { profileFormSchema } from "./schema";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';

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
            return setError(form, '', 'Unable to find user with username ' + event.locals.user.username);
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
            return setError(form, '', 'A database error occurred while updating the user');
        } finally {
            // update the user object
            event.locals.user = {
                ...event.locals.user,
                firstname: form.data.firstname,
                lastname: form.data.lastname,
                email: form.data.email || null,
            };
        }
        // return the form
        return { form };
    }
}