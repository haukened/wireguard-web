import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    let currentUser = event.locals.user;
    if (!currentUser) {
        // if there isn't a current user, send to logout
        return redirect(401, "/logout");
    }
    currentUser.password = "********";
    return {
        user: currentUser
    }
}