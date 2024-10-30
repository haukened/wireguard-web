// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, User } from "$lib/server/db";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null; // User object or null if not authenticated
			session: Session | null; // Session object or null if not authenticated
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};