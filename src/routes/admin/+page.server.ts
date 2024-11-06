import { db, users, type User } from "$lib/server/db";
import { message, setError, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { userFormSchema } from "./schema";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    // set up the form
    const form = await superValidate(zod(userFormSchema));
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
        form: form
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
    },
    update: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return 
        }
    }
}