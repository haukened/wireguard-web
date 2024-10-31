import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    let user = Object.assign({}, event.locals.user);
    user.password = "REDACTED";
    if (event.locals.user) {
        return {
            user: user,
        }
    }
    return {
        user: null,
    }
}