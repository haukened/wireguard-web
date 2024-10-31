import type { PageServerLoad } from "./$types";
import { invalidateSesssion, deleteSesssionTokenCookie } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    deleteSesssionTokenCookie(event);
    invalidateSesssion(event);
    return redirect(302, '/login');
}