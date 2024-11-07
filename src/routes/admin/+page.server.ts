import { db, users, type User, registrations } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";
import { type Infer, message, setError, superValidate } from "sveltekit-superforms";
import { userFormSchema, type UserFormSchema } from "./schema";
import { v4 as uuid4 } from "uuid";
import { zod } from "sveltekit-superforms/adapters";
import * as m from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from "./$types";
import type { Message } from "./message";

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
            return redirect(302, "/logout");
        }
        // validate the form
        const form = await superValidate<Infer<UserFormSchema>,Message>(event, zod(userFormSchema));
        if (!form.valid) {
            return message(form, {
                text: m.errorCannotDeleteUser(),
                token: undefined,
            })
        }
        // ensure we have a user Id
        if (!form.data.id) {
            return setError(form, '', m.errorUserIdRequired());
        }
        if (event.locals.user.id === form.data.id) {
            return setError(form, '', m.errorDeleteSelf());
        }
        // delete the user
        try {
            const deleted = await db.delete(users)
                .where(eq(users.id, form.data.id))
                .returning();
            // make sure the user was deleted
            if (deleted.length === 0) {
                return setError(form, '', m.errorUserNotFound());
            }
            return message(form, {
                text: m.adminUserDeleted({email: deleted[0].email}),
                token: undefined,
            });
        } catch (e) {
            console.log(e);
            return setError(form, '', m.errorDatabaseError());
        }
    },
    create: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return redirect(302, "/logout");
        }
        // validate the form
        const form = await superValidate<Infer<UserFormSchema>,Message>(event, zod(userFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // ensure we do not have a user Id
        if (form.data.id) {
            return setError(form, '', m.errorUserIdNotAllowed());
        }
        // create the user
        const created = await db.insert(users).values({
            firstname: form.data.firstname,
            lastname: form.data.lastname,
            email: form.data.email,
        }).returning();
        // ensure we created one and only one user
        if (created.length === 0) {
            console.log(m.loggingUnexpectedError({
                error: m.loggingNoUserCreated(),
            }));
            return setError(form, '', m.errorDatabaseError());
        }
        if (created.length > 1) {
            // this should never happen, but hey, we are being safe
            console.log(m.loggingUnexpectedError({
                error: m.loggingMultipleUsersCreated(),
            }));
            return setError(form, '', m.errorDatabaseError());
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
            return setError(form, '', m.errorCreatingRegistrationToken());
        }
        // return the created user and the registration token
        return message(form, {
            text: m.adminUserCreated({email: createdUser.email}),
            token: {
                value: regToken,
                email: createdUser.email,
                firstname: createdUser.firstname,
                lastname: createdUser.lastname,
            }
        });
    },
    update: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return redirect(302, "/logout");
        }
        // validate the form
        const form = await superValidate<Infer<UserFormSchema>,Message>(event, zod(userFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        // ensure we have a user Id
        if (!form.data.id) {
            return setError(form, '', m.errorUserIdRequired());
        }
        // update the user
        const updated: { id: number }[] = await db.update(users).set({
            firstname: form.data.firstname,
            lastname: form.data.lastname,
            email: form.data.email,
        }).where(eq(users.id, form.data.id)).returning({ id: users.id});
        // make sure the user was updated
        if (updated.length === 0) {
            return setError(form, '', m.errorUserNotFound());
        }
        // return the updated user
        return message(form, {
            text: m.adminUserUpdated(),
            token: undefined,
        });
    }
}