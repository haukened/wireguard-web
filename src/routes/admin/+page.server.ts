import { db, users, type User, registrations } from "$lib/server/db";
import { type Infer, message, setError, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { userFormSchema, type UserFormSchema } from "./schema";
import { fail, redirect, text } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { v4 as uuid4 } from "uuid";

type Message = {
    text: string | undefined;
    token: string | undefined;
}

export const load: PageServerLoad = async (event) => {
    // set up the form
    const form = await superValidate<Infer<UserFormSchema>,Message>(zod(userFormSchema));
    // server-side guard - check for user
    if (!event.locals.user) {
        return redirect(302, "/logout");
    }
    // get all users
    const privateUsers: User[] = await db.select().from(users);
    // remove sensitive data
    const publicUsers: User[] = privateUsers.map((u) => {
        u.password = null;
        return u;
    });
    // return the public users
    return { 
        users: publicUsers,
        form: form,
    }
}

export const actions: Actions = {
    delete: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return 
        }
    },
    create: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return 
        }
        // validate the form
        const form = await superValidate<Infer<UserFormSchema>,Message>(event, zod(userFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // ensure we do not have a user Id
        if (form.data.id) {
            return setError(form, '', 'User ID is not allowed');
        }
        // create the user
        const created = await db.insert(users).values({
            firstname: form.data.firstname,
            lastname: form.data.lastname,
            email: form.data.email,
        }).returning();
        // ensure we created one and only one user
        if (created.length === 0) {
            return setError(form, '', 'User not created');
        }
        if (created.length > 1) {
            // this should never happen, but hey, we are being safe
            return setError(form, '', 'Multiple users created');
        }
        const createdUser = created[0];
        // now we need to create a registration token so the user can create a password
        const regToken = uuid4();
        const registration = await db.insert(registrations).values({
            userId: createdUser.id,
            token: regToken,
            created_at: new Date(Date.now()),
        }).returning({ id: registrations.id });
        // ensure we created one and only one registration
        if (registration.length !== 1) {
            return setError(form, '', 'Error creating registration token');
        }
        // return the created user and the registration token
        return message(form, {
            text: 'User created',
            token: regToken,
        });
    },
    update: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return 
        }
        // validate the form
        const form = await superValidate<Infer<UserFormSchema>,Message>(event, zod(userFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // ensure we have a user Id
        if (!form.data.id) {
            return setError(form, '', 'User ID is required');
        }
        // update the user
        const updated: { id: number }[] = await db.update(users).set({
            firstname: form.data.firstname,
            lastname: form.data.lastname,
            email: form.data.email,
        }).where(eq(users.id, form.data.id)).returning({ id: users.id});
        // make sure the user was updated
        if (updated.length === 0) {
            return setError(form, '', 'User not found');
        }
        // return the updated user
        return message(form, {
            text: 'User updated',
            token: undefined,
        });
    }
}