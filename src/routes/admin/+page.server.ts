import { db, users, type User } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import { asc } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
    // server-side guard - check for user
    if (!event.locals.user) {
        return {
            status: 401,
            error: new Error("Unauthorized"),
        }
    }
    // get all users
    const privateUsers = await db.select().from(users).orderBy(asc(users.username));
    // remove sensitive data
    const publicUsers = privateUsers.map((u) => {
        const { password, ...publicUser } = u;
        return publicUser;
    });
    // return the public users
    return { users: publicUsers }
}