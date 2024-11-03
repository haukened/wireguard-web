import { sanitizeUser } from "$lib/server/db";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { passwordFormSchema } from './schema';

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