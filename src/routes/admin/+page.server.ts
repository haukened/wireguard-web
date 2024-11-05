import { db, users, type User } from "$lib/server/db";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    // server-side guard - check for user
    if (!event.locals.user) {
        return {
            status: 401,
            error: new Error("Unauthorized"),
        }
    }
    // get all users
    const privateUsers: User[] = await db.select().from(users);
    // remove sensitive data
    const publicUsers: User[] = privateUsers.map((u) => {
        u.password = null;
        return u;
    });
    // return the public users
    return { users: publicUsers }
}

export const actions: Actions = {
    delete: async (event) => {
        // server-side guard - check for user
        if (!event.locals.user) {
            return 
        }
    }
}