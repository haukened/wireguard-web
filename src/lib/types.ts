/**
 * Represents the information of a user, sanitized for client-side use.
 * 
 * @property {string} username - The username of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {Date} last_login - The date and time when the user last logged in.
 */
export type UserInfo = {
    username: string;
    firstname: string;
    lastname: string;
    email?: string;
    gravatar: string;
    last_login?: Date;
}