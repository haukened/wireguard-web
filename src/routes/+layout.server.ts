import { sanitizeUser } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    if (event.locals.user) {
        let clientSideUser = sanitizeUser(event.locals.user);
        return {
            user: clientSideUser,
        }
    }
    return {
        user: null,
    }
}