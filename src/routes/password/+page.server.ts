import { sanitizeUser } from "$lib/server/db";
import { message, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { passwordFormSchema } from './schema';
import type { Actions } from "./$types";
import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { setError } from "sveltekit-superforms";
import * as m from "$lib/paraglide/messages";
import { hashPassword, verifyPasswordHash } from "$lib/server/password";

export const load: PageServerLoad = async (event) => {
    let currentUser = event.locals.user;
    if (!currentUser) {
        // if there isn't a current user, send to logout
        return redirect(401, "/logout");
    }
    const user = sanitizeUser(currentUser);
    return { 
        form: await superValidate(zod(passwordFormSchema)),
    }
}

export const actions: Actions = {
    // Handle login form submission
    default: async (event) => {
        if (!event.locals.user) {
            return redirect(401, "/logout");
        }
        // validate the form
        const form = await superValidate(event, zod(passwordFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // first we need to check if the password and confirm fields are filled out
        if (!form.data.password || !form.data.confirm) {
            return setError(form, 'password', m.errorPasswordRequired());
        }
        // then we need to check if the passwords match
        if (form.data.password !== form.data.confirm) {
            return setError(form, 'confirm', m.errorPasswordsDoNotMatch());
        }
        // hash the password
        const hash = await hashPassword(form.data.password);
        // double check our work
        const reliable = await verifyPasswordHash(hash, form.data.password);
        if (!reliable) {
            return setError(form, '', m.errorPasswordHashing());
        }
        // update the user
        try {
            await db.update(users).set({
                password: hash,
                updated_at: new Date(Date.now())
            }).where(eq(users.id, event.locals.user.id));
        } catch (e) {
            return setError(form, '', m.errorDatabaseError());
        }
        // return the form but make sure to clear the password fields
        return message(form, m.passwordUpdated());
    }
}