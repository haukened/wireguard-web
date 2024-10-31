import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async (event) => {
    const user = event.locals.user;
    if (user) {
        return redirect(302, '/');
    }
}

export const actions: Actions = {
    // Handle login form submission
}